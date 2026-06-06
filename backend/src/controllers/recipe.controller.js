import Tarif from '../models/recipe.model.js';
import Kullanici from '../models/user.model.js';

// Tüm tarifleri listeleme
export const getRecipes = async (req, res, next) => {
    try {
        const recipes = await Tarif.find()
            .populate('author', 'username email')
            .populate('category', 'name');
        
        res.status(200).json({
            message: "Tarifler başarıyla getirildi.",
            data: recipes
        });

    } catch (error) {
        next(error);
    }
};

// Giriş yapan kullanıcının tariflerini getirme
export const getMyRecipes = async (req, res, next) => {
    try {
        const recipes = await Tarif.find({ author: req.user._id })
            .populate('author', 'username email')
            .populate('category', 'name');
        
        res.status(200).json({
            message: "Kendi tarifleriniz gösteriliyor.",
            data: recipes
        });

    } catch (error) {
        next(error);
    }
};

export const getFavorites = async (req, res, next) => {
    try {
        // Favori tarifleri yazar ve kategori detaylarıyla birlikte getir
        const user = await Kullanici.findById(req.user._id).populate({
            path: 'favorites',
            populate: [
                { path: 'author', select: 'username email' },
                { path: 'category', select: 'name' }
            ]
        });

        res.status(200).json({
            message: "Favori tarifleriniz getirildi.",
            data: user.favorites
        });

    } catch (error) {
        next(error);
    }
};
// Tarif favorileme / favoriden çıkarma

export const toggleFavorite = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await Kullanici.findById(req.user._id);
        const recipe = await Tarif.findById(id);

        if (!recipe) {
            return res.status(404).json({
                message: "Tarif bulunamadı."
            });
        }

        const isFavorited = user.favorites.includes(id);

        if (isFavorited) {
            // Tarif listede varsa favorilerden çıkar
            user.favorites = user.favorites.filter(favId => favId.toString() !== id);
            await user.save();
            return res.status(200).json({
                message: "Tarif favorilerden çıkarıldı."
            });
        } else {
            // Tarif listede yoksa favorilere ekle
            user.favorites.push(id);
            await user.save();
            return res.status(200).json({
                message: "Tarif favorilere eklendi."
            });
        }

    } catch (error) {
        next(error);
    }
};
// Tarife puan verme

export const rateRecipe = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { score } = req.body;

        if (!score || score < 1 || score > 5) {
            return res.status(400).json({
                message: "Lütfen 1 ile 5 arasında geçerli bir puan verin."
            });
        }

        const recipe = await Tarif.findById(id);

        if (!recipe) {
            return res.status(404).json({
                message: "Tarif bulunamadı."
            });
        }

        // Mevcut puanı kontrol et: varsa güncelle, yoksa yeni puan ekle
        const existingRating = recipe.ratings.find(
            (r) => r.user.toString() === req.user._id.toString()
        );

        if (existingRating) {
            existingRating.score = score;
        } else {
            recipe.ratings.push({ user: req.user._id, score });
        }

        await recipe.save();

        res.status(200).json({
            message: "Puanınız başarıyla kaydedildi.",
            data: recipe
        });

    } catch (error) {
        next(error);
    }
// ID bazlı tarif detayı getirme
};

export const getRecipeById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const recipe = await Tarif.findById(id)
            .populate('author', 'username email')
            .populate('category', 'name');

        if (!recipe) {
            return res.status(404).json({
                message: "Tarif bulunamadı."
            });
        }
        
        res.status(200).json({
            message: "Tarif başarıyla getirildi.",
            data: recipe
        });

    } catch (error) {
        next(error);
    }
// Yeni tarif oluşturma
};

export const createRecipe = async (req, res, next) => {
    try {
        const { title, description, ingredients, instructions, category, prepTime, cookTime, servings } = req.body;

        if (!title || !description || !ingredients || !instructions || !category) {
            return res.status(400).json({ 
                message: "Lütfen tüm gerekli alanları doldurun." 
            });
        }

        const newRecipe = new Tarif({
            title,
            description,
            ingredients,
            instructions,
            category,
            prepTime: prepTime || 0,
            cookTime: cookTime || 0,
            servings: servings || 1,
            author: req.user._id
        });

        await newRecipe.save();

        res.status(201).json({
            message: "Tarif başarıyla oluşturuldu.",
            data: newRecipe
        });

    } catch (error) {
        next(error);
    }
// Tarif bilgilerini güncelleme
};

export const updateRecipe = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description, ingredients, instructions, category, prepTime, cookTime, servings } = req.body;

        const recipe = await Tarif.findById(id);

        if (!recipe) {
            return res.status(404).json({
                message: "Tarif bulunamadı."
            });
        }

        // Yalnızca tarifi oluşturan veya admin güncelleyebilir
        if (recipe.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                message: "Bu işlemi yapmaya yetkiniz yok."
            });
        }

        recipe.title = title !== undefined ? title : recipe.title;
        recipe.description = description !== undefined ? description : recipe.description;
        recipe.ingredients = ingredients !== undefined ? ingredients : recipe.ingredients;
        recipe.instructions = instructions !== undefined ? instructions : recipe.instructions;
        recipe.category = category !== undefined ? category : recipe.category;
        recipe.prepTime = prepTime !== undefined ? prepTime : recipe.prepTime;
        recipe.cookTime = cookTime !== undefined ? cookTime : recipe.cookTime;
        recipe.servings = servings !== undefined ? servings : recipe.servings;

        await recipe.save();

        res.status(200).json({
            message: "Tarif başarıyla güncellendi.",
            data: recipe
        });

    } catch (error) {
        next(error);
    }
// Tarif silme
};

export const deleteRecipe = async (req, res, next) => {
    try {
        const { id } = req.params;

        const recipe = await Tarif.findById(id);

        if (!recipe) {
            return res.status(404).json({
                message: "Silinecek tarif bulunamadı."
            });
        }

        if (recipe.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                message: "Bu işlemi yapmaya yetkiniz yok."
            });
        }

        await Tarif.findByIdAndDelete(id);

        res.status(200).json({
            message: "Tarif başarıyla silindi."
        });

    } catch (error) {
        next(error);
    }
};