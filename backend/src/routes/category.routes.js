import express from 'express';
import { kullaniciDogrula, adminDogrula } from '../middleware/auth.middleware.js';
import { 
    getCategories, 
    createCategory, 
    updateCategory, 
    deleteCategory 
} from '../controllers/category.controller.js';

const router = express.Router();

// Kategori listeleme
router.get('/', getCategories);

// Kategori yönetimi (Korumalı - Admin)
router.post('/create-category', kullaniciDogrula, adminDogrula, createCategory);
router.put('/:id', kullaniciDogrula, adminDogrula, updateCategory);
router.delete('/:id', kullaniciDogrula, adminDogrula, deleteCategory);

export default router;