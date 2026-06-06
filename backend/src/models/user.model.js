import mongoose from 'mongoose';

const kullanicilar = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Lütfen geçerli bir e-posta adresi girin.']
    },
    password: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        enum: ['user', 'admin'], 
        default: 'user' 
    },
    favorites: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Tarif' 
    }]
}, { timestamps: true });

export default mongoose.model('Kullanici', kullanicilar, 'kullanicilar');
