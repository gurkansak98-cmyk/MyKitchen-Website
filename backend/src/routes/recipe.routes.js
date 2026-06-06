import express from 'express';
import { kullaniciDogrula } from '../middleware/auth.middleware.js';
import { 
    getRecipes, 
    getMyRecipes, 
    getFavorites, 
    toggleFavorite, 
    rateRecipe, 
    getRecipeById, 
    createRecipe, 
    updateRecipe, 
    deleteRecipe 
} from '../controllers/recipe.controller.js';

const router = express.Router();

// Tarif listeleme ve detay
router.get('/', getRecipes);
// Tarif etkileşimleri ve yönetimi (Korumalı)
router.get('/my-recipes', kullaniciDogrula, getMyRecipes);
router.get('/favorites', kullaniciDogrula, getFavorites);
router.post('/favorite/:id', kullaniciDogrula, toggleFavorite);
router.post('/rate/:id', kullaniciDogrula, rateRecipe);
router.post('/create-recipe', kullaniciDogrula, createRecipe);

// Parametreli route'lar en altta olmalı (ObjectId hatalarını önlemek için)
router.get('/:id', getRecipeById);
router.put('/:id', kullaniciDogrula, updateRecipe);
router.delete('/:id', kullaniciDogrula, deleteRecipe);

export default router;