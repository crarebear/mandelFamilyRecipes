import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { parseNYTRecipe } from '../src/lib/nytParser';

// Firebase Config from src/lib/firebase.ts
const firebaseConfig = {
  apiKey: "AIzaSyAPrdlRCQpZ-V0Yl9moeRL72gTJCMlM4WU",
  authDomain: "mandel-family-recipes.firebaseapp.com",
  projectId: "mandel-family-recipes",
  storageBucket: "mandel-family-recipes.firebasestorage.app",
  messagingSenderId: "651684354963",
  appId: "1:651684354963:web:1fa452db3a6cafa6a52666",
  measurementId: "G-X149SHQYKE"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const URLS = [
  "https://cooking.nytimes.com/recipes/9101-classic-shrimp-scampi",
  "https://cooking.nytimes.com/recipes/1024066-gochujang-buttered-noodles",
  "https://cooking.nytimes.com/recipes/4735-old-fashioned-beef-stew",
  "https://cooking.nytimes.com/recipes/1021031-one-pot-pasta-with-ricotta-and-lemon",
  "https://cooking.nytimes.com/recipes/1022718-roasted-tomato-and-white-bean-stew",
  "https://cooking.nytimes.com/recipes/1024222-marry-me-chicken",
  "https://cooking.nytimes.com/recipes/1022941-sticky-coconut-chicken-and-rice",
  "https://cooking.nytimes.com/recipes/1019183-turkey-chili",
  "https://cooking.nytimes.com/recipes/1020120-san-francisco-style-vietnamese-american-garlic-noodles",
  "https://cooking.nytimes.com/recipes/1022674-korean-bbq-style-meatballs",
  "https://cooking.nytimes.com/recipes/12965-spaghetti-carbonara",
  "https://cooking.nytimes.com/recipes/1139-original-plum-torte",
  "https://cooking.nytimes.com/recipes/1017577-best-gazpacho",
  "https://cooking.nytimes.com/recipes/1020970-turmeric-black-pepper-chicken-with-asparagus",
  "https://cooking.nytimes.com/recipes/1020631-thai-inspired-chicken-meatball-soup",
  "https://cooking.nytimes.com/recipes/1016834-jordan-marshs-blueberry-muffins",
  "https://cooking.nytimes.com/recipes/1016062-red-lentil-soup",
  "https://cooking.nytimes.com/recipes/1015831-creamy-macaroni-and-cheese",
  "https://cooking.nytimes.com/recipes/1021482-lemony-shrimp-and-bean-stew",
  "https://cooking.nytimes.com/recipes/1014721-shakshuka-with-feta",
  "https://cooking.nytimes.com/recipes/1020771-coconut-miso-salmon-curry",
  "https://cooking.nytimes.com/recipes/1016230-robertas-pizza-dough",
  "https://cooking.nytimes.com/recipes/1017161-oven-roasted-chicken-shawarma",
  "https://cooking.nytimes.com/recipes/1019732-spiced-chickpea-stew-with-coconut-and-turmeric",
  "https://cooking.nytimes.com/recipes/1015181-marcella-hazans-bolognese-sauce",
  "https://cooking.nytimes.com/recipes/11252-roasted-salmon-glazed-with-brown-sugar-and-mustard",
  "https://cooking.nytimes.com/recipes/1021151-cheesy-white-bean-tomato-bake",
  "https://cooking.nytimes.com/recipes/1022272-sheet-pan-baked-feta-with-broccolini-tomatoes-and-lemon",
  "https://cooking.nytimes.com/recipes/1020351-shrimp-scampi-with-orzo",
  "https://cooking.nytimes.com/recipes/1017101-red-curry-lentils-with-sweet-potatoes-and-spinach",
  "https://cooking.nytimes.com/recipes/1017327-roasted-chicken-provenal",
  "https://cooking.nytimes.com/recipes/1023712-lemony-white-bean-soup-with-turkey-and-greens",
  "https://cooking.nytimes.com/recipes/1020630-brothy-thai-curry-with-silken-tofu-and-herbs",
  "https://cooking.nytimes.com/recipes/6648-dutch-baby",
  "https://cooking.nytimes.com/recipes/1015981-classic-marinara-sauce",
  "https://cooking.nytimes.com/recipes/9558-takeout-style-sesame-noodles",
  "https://cooking.nytimes.com/recipes/1020830-caramelized-shallot-pasta",
  "https://cooking.nytimes.com/recipes/1017060-chocolate-chip-cookies",
  "https://cooking.nytimes.com/recipes/1021030-crispy-tofu-with-cashews-and-blistered-snap-peas",
  "https://cooking.nytimes.com/recipes/1016731-vegetarian-skillet-chili",
  "https://cooking.nytimes.com/recipes/11376-no-knead-bread",
  "https://cooking.nytimes.com/recipes/1017650-marcella-hazans-tomato-sauce",
  "https://cooking.nytimes.com/recipes/1015021-spicy-sesame-noodles-with-chicken-and-peanuts",
  "https://cooking.nytimes.com/recipes/1021230-omelet",
  "https://cooking.nytimes.com/recipes/1012670-everyday-pancakes",
  "https://cooking.nytimes.com/recipes/1890-roasted-brussels-sprouts-with-garlic",
  "https://cooking.nytimes.com/recipes/10782-katharine-hepburns-brownies"
];

async function ingestAll() {
  console.log(`Starting ingestion of ${URLS.length} recipes...`);
  
  for (const url of URLS) {
    try {
      console.log(`Processing: ${url}`);
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
          'Sec-Ch-Ua-Mobile': '?0',
          'Sec-Ch-Ua-Platform': '"macOS"',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Sec-Fetch-User': '?1',
          'Upgrade-Insecure-Requests': '1'
        }
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const html = await response.text();
      
      const recipe = parseNYTRecipe(html);
      
      await addDoc(collection(db, 'recipes'), {
        ...recipe,
        sourceUrl: url
      });
      console.log(`  ✓ Successfully added: ${recipe.title}`);
    } catch (err: any) {
      console.error(`  ✗ Failed: ${url} - ${err.message}`);
      // Log first bit of HTML to debug if it was a parsing error
      if (err.message.includes("Recipe object")) {
        console.log(`    [DEBUG] HTML Start (First 200 chars): ${err.htmlSnippet || 'N/A'}`);
      }
    }
    // Small delay to avoid hammering
    await new Promise(r => setTimeout(r, 500));
  }
  
  console.log("Ingestion complete!");
  process.exit(0);
}

ingestAll();
