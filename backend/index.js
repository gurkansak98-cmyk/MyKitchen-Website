import express from 'express';
import cors from 'cors';
import 'dotenv/config';

// Rota tanımları
import authRoutes from './src/routes/auth.routes.js';
import recipeRoutes from './src/routes/recipe.routes.js';
import categoryRoutes from './src/routes/category.routes.js';

// Veritabanı ve Middleware bileşenleri
import { connectDB } from './src/lib/db.js';
import { hataYakalayici } from './src/middleware/error.middleware.js';

const PORT = process.env.PORT || 3000;
const app = express();

// Global Middleware ayarları
app.use(cors()); 
app.use(express.json());

// API Rotaları
app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/categories", categoryRoutes);

// Sunucu kontrol rotası
app.get('/', (req,res) =>{
    res.json({
        message:'Sunucu çalışıyor.'
    })
});

// Merkezi hata yönetimi (Error Middleware)
app.use(hataYakalayici);

// Sunucuyu başlat ve veritabanına bağlan
app.listen(PORT, () => {
    console.log(`[Sunucu] Port: ${PORT}`);
    connectDB();
});

