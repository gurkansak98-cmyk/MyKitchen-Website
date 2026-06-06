import mongoose from 'mongoose';
import { seedData } from './seed.js';

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`[Sunucu] Veritabanı Bağlandı`);
        
        await seedData();
    } catch (error) {
        console.error(`[Sunucu] Veritabanı Hatası: ${error.message}`);
        process.exit(1);
    }
};
