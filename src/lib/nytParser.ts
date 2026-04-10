import type { Recipe } from './mockData';

type IngredientData = Recipe['ingredients'][number];

export function parseNYTRecipe(html: string): Omit<Recipe, 'id'> {
  // 1. Try JSON-LD (Standard SEO)
  const jsonLdMatch = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i);
  let recipeData: any = null;

  if (jsonLdMatch) {
    try {
      const data = JSON.parse(jsonLdMatch[1]);
      recipeData = Array.isArray(data) 
        ? data.find(item => item['@type'] === 'Recipe') 
        : (data['@graph'] ? data['@graph'].find((item: any) => item['@type'] === 'Recipe') : data);
    } catch (e) {
      console.error("Failed to parse JSON-LD", e);
    }
  }

  // 2. Fallback to __NEXT_DATA__ (NYT uses Next.js)
  if (!recipeData || recipeData['@type'] !== 'Recipe') {
    const nextDataMatch = html.match(/<script[^>]*id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/i);
    if (nextDataMatch) {
      try {
        const nextData = JSON.parse(nextDataMatch[1]);
        const props = nextData.props?.pageProps?.initialState?.recipe || nextData.props?.pageProps?.recipe;
        if (props) {
          // Map NEXT_DATA props to our schema if needed, but usually it's also a JSON-LD style object in some sub-fields
          // For NYT, we'll try to find any object with recipe fields
        }
      } catch (e) {}
    }
  }

  if (!recipeData || recipeData['@type'] !== 'Recipe') {
    throw new Error("Could not find Recipe object in HTML (tried JSON-LD and NEXT_DATA)");
  }

  // Extract instructions
  const instructions = Array.isArray(recipeData.recipeInstructions)
    ? recipeData.recipeInstructions.map((step: any) => step.text || step.name || step).filter(Boolean)
    : [];

  // Parse ingredients
  const ingredients: IngredientData[] = (recipeData.recipeIngredient || []).map((raw: string) => {
    return parseIngredient(raw);
  });

  // Extract category
  const categoryStr = Array.isArray(recipeData.recipeCategory) ? recipeData.recipeCategory[0] : recipeData.recipeCategory;
  const category = mapCategory(categoryStr || 'dinner');

  // Extract Tags
  const tags = ['NYT'];
  if (recipeData.keywords) {
    const keywords = typeof recipeData.keywords === 'string' ? recipeData.keywords.split(',') : recipeData.keywords;
    keywords.forEach((k: string) => {
      const clean = k.trim().toLowerCase();
      if (clean && clean.length < 20 && !tags.includes(clean)) tags.push(clean);
    });
  }

  return {
    title: recipeData.name || "Untitled NYT Recipe",
    ingredients,
    instructions,
    image: Array.isArray(recipeData.image) ? recipeData.image[0] : (recipeData.image?.url || recipeData.image || ""),
    category,
    tags,
    cookCount: 0,
    createdAt: new Date().toISOString(),
    prepTime: formatDuration(recipeData.prepTime),
    cookTime: formatDuration(recipeData.cookTime || recipeData.totalTime)
  };
}

function formatDuration(iso: string): string | undefined {
  if (!iso) return undefined;
  // PT1H30M -> 1 hr 30 min
  // PT45M -> 45 min
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return iso;
  
  const hours = match[1] ? `${match[1]} hr` : '';
  const mins = match[2] ? `${match[2]} min` : '';
  
  return `${hours} ${mins}`.trim();
}

function parseIngredient(raw: string): IngredientData {
  // Simple regex to extract amount and name
  // Example: "1 1/2 cups all-purpose flour"
  const amountMatch = raw.match(/^([\d\s\/\.¼½¾⅓⅔⅛⅜⅝⅞]+)?\s*([a-zA-Z\.]+)?\s*(.*)$/);
  
  if (amountMatch) {
    const amount = `${(amountMatch[1] || "").trim()} ${(amountMatch[2] || "").trim()}`.trim();
    return {
      amount,
      name: (amountMatch[3] || raw).trim()
    };
  }

  return { amount: "", name: raw.trim() };
}

function mapCategory(cat: string): Recipe['category'] {
  const c = cat.toLowerCase();
  if (c.includes('breakfast')) return 'breakfast';
  if (c.includes('lunch')) return 'lunch';
  if (c.includes('dinner') || c.includes('main')) return 'dinner';
  if (c.includes('snack')) return 'snack';
  if (c.includes('dessert') || c.includes('sweet')) return 'dessert';
  return 'dinner';
}
