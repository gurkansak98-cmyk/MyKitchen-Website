import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Kullanici from '../models/user.model.js';

// Yeni kullanıcı kaydı
export const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ 
                message: "Lütfen username, email ve password alanlarını doldurun." 
            });
        }

        const existingUser = await Kullanici.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({ 
                message: "Bu kullanıcı adı veya email adresi zaten kullanımda." 
            });
        }

        // Şifre güvenliği için bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new Kullanici({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();

        // Kayıt sonrası otomatik giriş için token oluşturma
        const token = jwt.sign(
            { id: newUser._id, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(201).json({
            message: "Kayıt işlemi başarıyla tamamlandı.",
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
                favorites: []
            }
        });

    } catch (error) {
        next(error);
    }
};

// Kullanıcı girişi ve token oluşturma
export const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ 
                message: "Lütfen kullanıcı adı ve şifrenizi girin." 
            });
        }

        const user = await Kullanici.findOne({ username });
        if (!user) {
            return res.status(400).json({ 
                message: "Hatalı kullanıcı adı veya şifre." 
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ 
                message: "Hatalı kullanıcı adı veya şifre." 
            });
        }

        // Kullanıcı ID ve rol bilgisini içeren JWT üretimi
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: "Giriş başarılı.",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                favorites: user.favorites || []
            }
        });

    } catch (error) {
        next(error);
    }
};
// Kullanıcı profili güncelleme

export const updateProfile = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await Kullanici.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ 
                message: "Kullanıcı bulunamadı." 
            });
        }

        if (email) {
            user.email = email;
        }
        
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();
        res.status(200).json({ 
            message: "Profil başarıyla güncellendi." 
        });

    } catch (error) {
        next(error);
    }
};
// Kullanıcı hesabı silme

export const deleteProfile = async (req, res, next) => {
    try {
        await Kullanici.findByIdAndDelete(req.user._id);
        res.status(200).json({ 
            message: "Hesabınız başarıyla silindi." 
        });
    } catch (error) {
        next(error);
    }
};

// Tüm kullanıcıları listeleme
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await Kullanici.find({}, '-password');
        res.status(200).json({
            message: "Kullanıcılar başarıyla getirildi.",
            data: users
        });
    } catch (error) {
        next(error);
    }
};

// Admin tarafından kullanıcı silme
export const deleteUserAdmin = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (req.user._id.toString() === id) {
            return res.status(400).json({
                message: "Kendi hesabınızı bu ekrandan silemezsiniz."
            });
        }
        const deleted = await Kullanici.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({
                message: "Kullanıcı bulunamadı."
            });
        }
        res.status(200).json({
            message: "Kullanıcı başarıyla silindi."
        });
    } catch (error) {
        next(error);
    }
};