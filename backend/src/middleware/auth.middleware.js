import jwt from 'jsonwebtoken';
import Kullanici from '../models/user.model.js';

export const kullaniciDogrula = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await Kullanici.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({
                    message: "Yetkisiz erişim. Kullanıcı bulunamadı."
                });
            }

            next();
        } catch (error) {
            console.error(`[Sunucu] Yetkilendirme Hatası: ${error.message}`);
            return res.status(401).json({ 
                message: "Yetkisiz erişim. Geçersiz veya süresi dolmuş token." 
            });
        }
    }

    if (!token) {
        return res.status(401).json({ 
            message: "Yetkisiz erişim. Lütfen giriş yapın." 
        });
    }
};

export const adminDogrula = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ 
            message: "Erişim reddedildi. Admin yetkisi gereklidir." 
        });
    }
};
