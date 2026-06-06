import express from 'express';
import { kullaniciDogrula, adminDogrula } from '../middleware/auth.middleware.js';
import { register, login, updateProfile, deleteProfile, getAllUsers, deleteUserAdmin } from '../controllers/auth.controller.js';

const router = express.Router();

// Kayıt ve Giriş işlemleri
router.post('/register', register);
router.post('/login', login);

// Profil yönetimi (Korumalı Rotalar)
router.put('/update-profile', kullaniciDogrula, updateProfile);
router.delete('/delete-profile', kullaniciDogrula, deleteProfile);

// Admin İşlemleri
router.get('/users', kullaniciDogrula, adminDogrula, getAllUsers);
router.delete('/users/:id', kullaniciDogrula, adminDogrula, deleteUserAdmin);

export default router;