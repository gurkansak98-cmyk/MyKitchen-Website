export const hataYakalayici = (err, req, res, next) => {
    console.error(`[Sunucu] Hata: ${err.message}`);
    
    // Eğer response daha önce gönderildiyse Express'in kendi hata yöneticisine bırak
    if (res.headersSent) {
        return next(err);
    }

    res.status(500).json({
        message: "Sunucu hatası oluştu.",
        error: err.message // Geliştirme aşamasında sorunu görmek için
    });
};