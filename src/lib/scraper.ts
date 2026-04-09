import { geminiModel } from "./gemini";
import type { Recipe } from "./mockData";

const PROXIES = [
  "https://api.allorigins.win/get?url=",
  "https://api.codetabs.com/v1/proxy?quest=",
  "https://corsproxy.io/?",
  "https://thingproxy.freeboard.io/fetch/",
  "https://proxy.cors.sh/",
];

async function callGeminiWithRetry(prompt: string, retries = 3, delay = 2000): Promise<string> {
  try {
    const result = await geminiModel.generateContent(prompt);
    return result.response.text();
  } catch (error: any) {
    if (retries > 0 && (error.message?.includes('503') || error.message?.includes('429') || error.message?.includes('quota') || error.message?.includes('capacity'))) {
      console.log(`[AI] Busy or Quota hit. Retrying in ${delay / 1000}s... (${retries} left)`);
      await new Promise(res => setTimeout(res, delay));
      return callGeminiWithRetry(prompt, retries - 1, delay * 2);
    }
    throw error;
  }
}

export async function scrapeRecipeFromUrl(url: string): Promise<Omit<Recipe, 'id'>> {
  let html = "";
  let errorMsg = "";

  // 1. Fetch HTML via CORS Proxies
  for (const proxy of PROXIES) {
    try {
      const response = await fetch(`${proxy}${encodeURIComponent(url)}`);
      if (!response.ok) continue;
      
      if (proxy.includes("allorigins")) {
        const data = await response.json();
        html = data.contents;
      } else {
        html = await response.text();
      }
      
      if (html) break;
    } catch (e) {
      errorMsg = String(e);
      continue;
    }
  }

  if (!html) throw new Error(`Could not reach the website: ${errorMsg || 'CORS restriction'}`);

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // 2. Structured Data Extraction (JSON-LD)
    const jsonLdScripts = doc.querySelectorAll('script[type="application/ld+json"]');
    let recipeData: any = null;

    for (const script of Array.from(jsonLdScripts)) {
      try {
        const json = JSON.parse(script.textContent || '');
        const findRecipe = (obj: any): any => {
          if (obj['@type'] === 'Recipe' || (Array.isArray(obj['@type']) && obj['@type'].includes('Recipe'))) return obj;
          if (obj['@graph'] && Array.isArray(obj['@graph'])) return obj['@graph'].find((item: any) => item['@type'] === 'Recipe');
          if (Array.isArray(obj)) return obj.find(findRecipe);
          return null;
        };
        recipeData = findRecipe(json);
        if (recipeData) break;
      } catch (e) { continue; }
    }

    let inputForAI = "";
    if (recipeData) {
      console.log("[Scraper] JSON-LD Found. Passing structured data to Gemini.");
      inputForAI = JSON.stringify(recipeData).slice(0, 10000);
    } else {
      console.log("[Scraper] No JSON-LD. Falling back to innerText.");
      const junk = doc.querySelectorAll('script, style, nav, footer, header, ads, .ads, #ads');
      junk.forEach(s => s.remove());
      inputForAI = doc.body.innerText.replace(/\s+/g, ' ').trim().slice(0, 8000);
    }

    // 3. Prompt Gemini to normalize
    const prompt = `
      Extract/Normalize recipe details. 
      Format as a valid JSON object matching this interface:
      {
        title: string;
        category: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert';
        ingredients: { name: string; amount: string }[];
        instructions: string[];
        sourceUrl: string;
      }
      
      Rules:
      - Category MUST be one of: 'breakfast', 'lunch', 'dinner', 'snack', 'dessert'.
      - Keep instructions clear steps.
      - Return ONLY the JSON object.
      - Source URL is: ${url}
      
      Input: "${inputForAI}"
    `;

    const responseText = await callGeminiWithRetry(prompt);
    const cleanJson = responseText.replace(/```json|```/gi, '').trim();
    return JSON.parse(cleanJson);
  } catch (error: any) {
    console.error('Extraction Error:', error);
    throw new Error(error.message || 'I had trouble reading that recipe. Maybe try another link?');
  }
}
