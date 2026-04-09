import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, addDoc, updateDoc, doc, orderBy, where, getDocs, deleteDoc, writeBatch } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Recipe, MenuItem, FeatureRequest, DayOfWeek } from '../lib/mockData';

export function useFamilyData() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [staples, setStaples] = useState<string[]>([]);
  const [commonIngredients, setCommonIngredients] = useState<string[]>([]);
  const [weeklyMenu, setWeeklyMenu] = useState<MenuItem[]>([]);
  const [featureRequests, setFeatureRequests] = useState<FeatureRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribeRecipes: () => void;
    let unsubscribeStaples: () => void;
    let unsubscribeCommon: () => void;
    let unsubscribeFeedback: () => void;

    try {
      const recipesQuery = query(collection(db, 'recipes'), orderBy('createdAt', 'desc'));
      unsubscribeRecipes = onSnapshot(recipesQuery, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Recipe));
        setRecipes(data);
        setLoading(false);
      }, (err) => {
        console.error("Firestore Recipes Error:", err);
        setError("Database connection lost.");
        setLoading(false);
      });

      unsubscribeStaples = onSnapshot(collection(db, 'staples'), (snapshot) => {
        const data = snapshot.docs.map(doc => doc.data().name as string);
        setStaples(data);
      });

      unsubscribeCommon = onSnapshot(collection(db, 'common_ingredients'), (snapshot) => {
        const data = snapshot.docs.map(doc => doc.data().name as string);
        setCommonIngredients(data);
      });
      
      const feedbackQuery = query(collection(db, 'feature_requests'), orderBy('createdAt', 'desc'));
      unsubscribeFeedback = onSnapshot(feedbackQuery, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FeatureRequest));
        setFeatureRequests(data);
      });

    } catch (err: any) {
      console.error("Firebase Hook Error:", err);
      setError(err.message);
      setLoading(false);
    }

    return () => {
      if (unsubscribeRecipes) unsubscribeRecipes();
      if (unsubscribeStaples) unsubscribeStaples();
      if (unsubscribeCommon) unsubscribeCommon();
      if (unsubscribeFeedback) unsubscribeFeedback();
    };
  }, []);

  useEffect(() => {
    let unsubscribeMenu: () => void;
    try {
      unsubscribeMenu = onSnapshot(collection(db, 'weekly_menu'), (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
        setWeeklyMenu(data);
      });
    } catch (err) {
      console.error("Menu Listener Error:", err);
    }
    return () => { if (unsubscribeMenu) unsubscribeMenu(); };
  }, []);

  // Computed: Unify all unique tags across the library
  const allTags = Array.from(new Set(recipes.flatMap(r => r.tags || []))).sort();

  const addRecipe = async (recipe: Omit<Recipe, 'id'>) => {
    const docRef = await addDoc(collection(db, 'recipes'), {
      ...recipe,
      cookCount: recipe.cookCount || 0,
      createdAt: new Date().toISOString()
    });
    for (const ing of recipe.ingredients) {
      addCommonIngredient(ing.name);
    }
    return docRef.id;
  };

  const updateRecipe = async (id: string, data: Partial<Recipe>) => {
    const recipeRef = doc(db, 'recipes', id);
    await updateDoc(recipeRef, data);
    if (data.ingredients) {
      for (const ing of data.ingredients) {
        addCommonIngredient(ing.name);
      }
    }
  };

  const deleteRecipe = async (id: string) => {
    await deleteDoc(doc(db, 'recipes', id));
  };

  const addCommonIngredient = async (name: string) => {
    const lowerName = name.trim().toLowerCase();
    if (!lowerName) return;
    
    const exists = commonIngredients.some(i => i.toLowerCase() === lowerName);
    if (!exists) {
      await addDoc(collection(db, 'common_ingredients'), { name: name.trim() });
    }
  };

  const toggleStaple = async (name: string) => {
    const isPresent = staples.includes(name);
    if (isPresent) {
      const q = query(collection(db, 'staples'), where('name', '==', name));
      const snapshot = await getDocs(q);
      for (const d of snapshot.docs) await deleteDoc(d.ref);
    } else {
      await addDoc(collection(db, 'staples'), { name });
    }
  };

  const initializeStaples = async (names: string[]) => {
    for (const name of names) await addDoc(collection(db, 'staples'), { name });
  };

  const addRecipeToMenu = async (day: DayOfWeek, recipeId: string) => {
    // 1. Log to Weekly Menu
    await addDoc(collection(db, 'weekly_menu'), {
      day,
      recipeId,
      createdAt: new Date().toISOString()
    });

    // 2. Intelligence: Update Recipe Metadata (Cook Count + History)
    const recipe = recipes.find(r => r.id === recipeId);
    if (recipe) {
      const recipeRef = doc(db, 'recipes', recipeId);
      await updateDoc(recipeRef, {
        cookCount: (recipe.cookCount || 0) + 1,
        lastScheduled: new Date().toISOString()
      });
    }
  };

  const removeFromMenu = async (id: string) => {
    await deleteDoc(doc(db, 'weekly_menu', id));
  };

  const clearMenu = async () => {
    const q = query(collection(db, 'weekly_menu'));
    const snapshot = await getDocs(q);
    const batch = writeBatch(db);
    snapshot.docs.forEach(d => batch.delete(d.ref));
    await batch.commit();
  };

  const submitFeatureRequest = async (title: string, description: string, image?: string) => {
    const data: any = {
      title,
      description,
      status: 'new',
      createdAt: new Date().toISOString()
    };
    if (image) data.image = image;
    
    await addDoc(collection(db, 'feature_requests'), data);
  };

  const updateFeatureRequestStatus = async (id: string, status: FeatureRequest['status']) => {
    const ref = doc(db, 'feature_requests', id);
    await updateDoc(ref, { status });
  };

  return { 
    recipes, 
    staples, 
    commonIngredients, 
    weeklyMenu,
    featureRequests,
    allTags,
    loading, 
    error, 
    addRecipe, 
    updateRecipe, 
    deleteRecipe, 
    initializeStaples, 
    toggleStaple,
    addRecipeToMenu,
    removeFromMenu,
    clearMenu,
    submitFeatureRequest,
    updateFeatureRequestStatus
  };
}
