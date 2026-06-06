import Kategori from '../models/category.model.js';

// Tüm kategorileri listeleme
export const getCategories = async (req, res, next) => {
    try {
        const categories = await Kategori.find();
        
        res.status(200).json({
            message: "Kategoriler başarıyla getirildi.",
            data: categories
        });

    } catch (error) {
        next(error);
    }
};

// Yeni kategori oluşturma (Admin)
export const createCategory = async (req, res, next) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ 
                message: "Lütfen kategori adını girin." 
            });
        }

        // Aynı isimde kategori var mı kontrolü
        const existingCategory = await Kategori.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ 
                message: "Bu kategori zaten mevcut." 
            });
        }

        const newCategory = new Kategori({
            name,
            description
        });

        await newCategory.save();

        res.status(201).json({
            message: "Kategori başarıyla oluşturuldu.",
            data: newCategory
        });

    } catch (error) {
        next(error);
    }
};

// Mevcut kategoriyi güncelleme (Admin)
export const updateCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        // Mevcut kategoriyi getir ve bilgilerini güncelle
        
        const category = await Kategori.findById(id);
        if (!category) {
            return res.status(404).json({ 
                message: "Güncellenecek kategori bulunamadı." 
            });
        }

        category.name = name || category.name;
        category.description = description !== undefined ? description : category.description;

        await category.save();

        res.status(200).json({
            message: "Kategori başarıyla güncellendi.",
            data: category
        });

    } catch (error) {
        next(error);
    }
};
// Kategoriyi silme (Admin)

export const deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params;

        const category = await Kategori.findById(id);
        if (!category) {
            return res.status(404).json({ 
                message: "Silinmek istenen kategori bulunamadı." 
            });
        }

        await Kategori.findByIdAndDelete(id);

        res.status(200).json({ 
            message: "Kategori başarıyla silindi." 
        });

    } catch (error) {
        next(error);
    }
};