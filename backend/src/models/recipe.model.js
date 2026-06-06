import mongoose from 'mongoose';

const tarifler = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    ingredients: [{ 
        type: String, 
        required: true 
    }],
    instructions: { 
        type: String, 
        required: true 
    },
    author: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Kullanici', 
        required: true 
    },
    category: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Kategori', 
        required: true 
    },
    prepTime: {
        type: Number,
        default: 0
    },
    cookTime: {
        type: Number,
        default: 0
    },
    servings: {
        type: Number,
        default: 1
    },
    ratings: [{
        user: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Kullanici' 
        },
        score: { 
            type: Number, 
            required: true, 
            min: 1, 
            max: 5 
        }
    }]
}, { timestamps: true });

export default mongoose.model('Tarif', tarifler, 'tarifler');
