export interface Recipe {
  id: string;
  title: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert';
  ingredients: { name: string; amount: string; tags?: string[] }[];
  instructions: string[];
  tags: string[];
  sourceUrl?: string;
  image?: string;
  createdAt?: string;
  cookCount: number;
  lastScheduled?: string;
  prepTime?: string;
  cookTime?: string;
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface MenuItem {
  id: string;
  recipeId: string;
  day: DayOfWeek;
  createdAt: string;
}

export interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  image?: string; // base64
  status: 'new' | 'in progress' | 'fixed' | 'WAI';
  createdAt: string;
}

export const MOCK_RECIPES: Recipe[] = [
  {
    id: '1',
    title: 'Grandma\'s Fluffy Pancakes',
    category: 'breakfast',
    ingredients: [
      { name: 'Flour', amount: '2 cups' },
      { name: 'Sugar', amount: '2 tbsp' },
      { name: 'Baking Powder', amount: '1 tbsp' },
      { name: 'Salt', amount: '1/2 tsp' },
      { name: 'Milk', amount: '1 1/2 cups' },
      { name: 'Egg', amount: '1 large' },
      { name: 'Butter', amount: '3 tbsp (melted)' },
    ],
    instructions: [
      'In a large bowl, sift together the flour, baking powder, salt and sugar.',
      'Make a well in the center and pour in the milk, egg and melted butter; mix until smooth.',
      'Heat a lightly oiled griddle or frying pan over medium-high heat.',
      'Bourbon butter sauce recommended.'
    ],
    tags: ['breakfast', 'classic'],
    cookCount: 12
  },
  {
    id: '2',
    title: 'Spicy Basil Chicken (Pad Krapow)',
    category: 'dinner',
    ingredients: [
      { name: 'Chicken Breast', amount: '500g (minced)' },
      { name: 'Garlic', amount: '4 cloves' },
      { name: 'Thai Chilies', amount: '3-5' },
      { name: 'Soy Sauce', amount: '1 tbsp' },
      { name: 'Fish Sauce', amount: '1 tbsp' },
      { name: 'Oyster Sauce', amount: '1 tbsp' },
      { name: 'Sugar', amount: '1 tsp' },
      { name: 'Holy Basil', amount: '1 small bunch' },
    ],
    instructions: [
      'Pound garlic and chilies together into a paste.',
      'Heat oil in a wok over high heat and add the garlic-chili paste. Stir-fry for 30 seconds.',
      'Add the minced chicken and stir-fry until almost cooked.',
      'Add soy sauce, fish sauce, oyster sauce, and sugar. Continue stir-frying until chicken is fully cooked.',
      'Throw in the basil leaves and turn off the heat. Stir until basil is wilted.'
    ],
    tags: ['dinner', 'spicy'],
    cookCount: 5
  }
];

export const MOCK_STAPLES = [
  'Flour', 'Sugar', 'Salt', 'Milk', 'Egg', 'Butter', 'Garlic', 'Oil', 'Soy Sauce', 'Water', 'Pepper'
];
