import mongoose from 'mongoose';
import Kategori from '../models/category.model.js';
import Tarif from '../models/recipe.model.js';
import Kullanici from '../models/user.model.js';
import bcrypt from 'bcryptjs';

export const seedData = async () => {
    try {
        const count = await Kullanici.countDocuments();
        if (count > 0) {
            console.log("[Sunucu] Mock veriler zaten mevcut, tekrar eklenmedi.");
            return;
        }

        await Kullanici.deleteMany();
        await Kategori.deleteMany();
        await Tarif.deleteMany();

        const salt = await bcrypt.genSalt(10);
        const adminHashedPassword = await bcrypt.hash("server", salt);
        const userHashedPassword = await bcrypt.hash("sak", salt);

        const adminUser = new Kullanici({
            username: "admin",
            email: "admin@gmail.com",
            password: adminHashedPassword,
            role: "admin"
        });
        await adminUser.save();

        const testUser = new Kullanici({
            username: "gurkan",
            email: "gurkan.sak@gmail.com",
            password: userHashedPassword,
            role: "user"
        });
        await testUser.save();

        const kat1 = new Kategori({
            name: "Ana Yemekler",
            description: "Doyurucu akşam yemekleri"
        });
        const kat2 = new Kategori({
            name: "Tatlılar",
            description: "Şerbetli ve sütlü tatlılar"
        });
        const kat3 = new Kategori({
            name: "Çorbalar",
            description: "Sıcak başlangıçlar"
        });
        const kat4 = new Kategori({
            name: "Salatalar",
            description: "Hafif ve sağlıklı seçenekler"
        });
        const kat5 = new Kategori({
            name: "Atıştırmalıklar",
            description: "Ara öğünler için pratik lezzetler"
        });

        await Kategori.insertMany([kat1, kat2, kat3, kat4, kat5]);

        const tarif1 = new Tarif({
            title: "Karnıyarık",
            description: "Geleneksel Türk mutfağının vazgeçilmezi.",
            ingredients: ["Patlıcan", "Kıyma", "Soğan", "Domates", "Biber"],
            instructions: "1. Alacalı soyduğunuz 4 adet patlıcanı tuzlu suda 15 dakika bekletip süzün ve kurulayın.\n2. Geniş bir tavada sıvı yağı kızdırıp patlıcanları her tarafı hafif yumuşayana kadar yaklaşık 10 dakika kızartın ve kağıt havlu üzerine alın.\n3. Ayrı bir tavada kıymayı suyunu salıp çekene kadar kavurun. İnce doğranmış soğan, sarımsak ve biberleri ekleyip 5 dakika daha soteleyin.\n4. Salçayı, küp doğranmış domatesleri, tuzu ve baharatları ekleyip kısık ateşte 10 dakika pişmeye bırakın.\n5. Kızaran patlıcanların ortasını bir bıçak yardımıyla yarıp hazırladığınız kıymalı harç ile bolca doldurun.\n6. Üzerlerini domates dilimi ve biberle süsleyip, fırın tepsisine dizin. 1 çay bardağı sıcak su ekleyerek önceden ısıtılmış 180 derece fırında yaklaşık 35-40 dakika pişirin.",
            category: kat1._id,
            author: adminUser._id,
            prepTime: 20,
            cookTime: 40,
            servings: 4
        });

        const tarif2 = new Tarif({
            title: "Sütlaç",
            description: "Fırınlanmış nefis sütlü tatlı.",
            ingredients: ["Süt", "Pirinç", "Şeker", "Nişasta", "Vanilya"],
            instructions: "1. 1 çay bardağı pirinci yıkayıp 2 su bardağı su ile pirinçler yumuşayana kadar haşlayın.\n2. Başka bir tencerede 1 litre sütü, haşlanmış pirinci ve 1 su bardağı toz şekeri karıştırarak kaynatın. Yaklaşık 10-15 dakika kısık ateşte pişirin.\n3. 1 yemek kaşığı nişastayı yarım çay bardağı suyla ezip yavaşça tencereye ekleyin ve hızlıca karıştırın. Kıvam alması için 5-10 dakika daha kaynatın.\n4. Vanilyayı ekleyip ocaktan alın. Sütlacı ısıya dayanıklı fırın kaselerine (genelde 6 adet çıkacaktır) paylaştırın.\n5. Kaseleri fırın tepsisine dizin ve tepsiye kaselerin yarısına gelecek kadar soğuk su doldurun.\n6. 200 derecede fırının sadece üst ızgara ayarında, sütlaçların üzeri kızarana kadar yaklaşık 10-15 dakika fırınlayın.",
            category: kat2._id,
            author: testUser._id,
            prepTime: 15,
            cookTime: 25,
            servings: 6
        });

        const tarif3 = new Tarif({
            title: "Mercimek Çorbası",
            description: "Lokanta usulü süzme mercimek çorbası.",
            ingredients: ["Kırmızı mercimek", "Soğan", "Havuç", "Patates", "Tereyağı"],
            instructions: "1. Kırmızı mercimeği bol suyla yıkayıp süzün.\n2. Bir tencerede 1 yemek kaşığı tereyağı ve sıvı yağı kızdırın. İnce doğranmış 1 adet soğan, 1 adet patates ve 1 adet havucu 3-4 dakika soteleyin.\n3. Yıkanmış mercimeği tencereye ekleyip 1-2 dakika daha kavurun.\n4. Üzerine 6 su bardağı sıcak su (varsa et/tavuk suyu) ekleyip tencerenin kapağını kapatın. Sebzeler iyice yumuşayana kadar yaklaşık 20 dakika pişirin.\n5. Çorba piştikten sonra pürüzsüz bir kıvam alması için blenderdan geçirin. Tuz ve karabiberini ayarlayın.\n6. Üzeri için küçük bir tavada tereyağını kızdırıp toz kırmızı biberi yakın ve kaselere paylaştırdığınız çorbanın üzerinde gezdirin.",
            category: kat3._id,
            author: adminUser._id,
            prepTime: 10,
            cookTime: 20,
            servings: 4
        });

        const tarif4 = new Tarif({
            title: "Çoban Salatası",
            description: "Taze sebzelerle hazırlanan klasik Türk salatası.",
            ingredients: ["Domates", "Salatalık", "Kuru soğan", "Biber", "Zeytinyağı"],
            instructions: "1. 4 adet orta boy domatesi ve 3 adet salatalığı alacalı soyup küçük küpler halinde doğrayın.\n2. 1 adet kuru soğanı ince piyazlık veya yemeklik doğrayıp, isteğe bağlı olarak hafifçe tuzla ovup yıkayın.\n3. 2 adet yeşil biberi ortadan ikiye bölüp çekirdeklerini temizledikten sonra ince ince dilimleyin.\n4. Geniş bir salata kasesine doğradığınız tüm sebzeleri ve ince kıyılmış maydanozu ekleyin.\n5. Sosu için yarım çay bardağı zeytinyağı, 1 adet limonun suyu ve tuzu küçük bir kasede çırpın.\n6. Hazırladığınız sosu salatanın üzerine gezdirip hafifçe karıştırın ve taze nane yapraklarıyla servis edin.",
            category: kat4._id,
            author: testUser._id,
            prepTime: 15,
            cookTime: 0,
            servings: 4
        });

        const tarif5 = new Tarif({
            title: "İskender Kebap",
            description: "Bursa yöresine ait enfes kebap.",
            ingredients: ["Dana eti", "Tırnak pide", "Domates sosu", "Tereyağı", "Yoğurt"],
            instructions: "1. Dondurucudan çıkardığınız dana etini çok ince (yaprak şeklinde) dilimleyin.\n2. Bir tavaya tereyağı ekleyip ince et dilimlerini yüksek ateşte her iki tarafı da güzelce kızarana kadar yaklaşık 5-7 dakika soteleyin.\n3. Domates sosu için; ayrı bir sos tavasında tereyağını eritin, domates salçasını ekleyip kavurun. Ardından rendelenmiş domates, tuz ve sıcak su ekleyerek 5 dakika kaynatın.\n4. Tırnak pideleri küp küp doğrayın ve fırında veya tavada hafifçe ısıtın.\n5. Servis tabaklarının tabanına ısıtılmış pideleri yayın. Üzerine biraz hazırladığınız sıcak domates sosundan gezdirin.\n6. Pidelerin üzerine kızarttığınız yaprak etleri dizin. Kalan sıcak domates sosunu etlerin üzerine dökün.\n7. Ayrı bir tavada bol tereyağını köpürene kadar kızdırın ve tabakların üzerine gezdirin. Tabağın yanına 2-3 kaşık süzme yoğurt koyarak sıcak servis yapın.",
            category: kat1._id,
            author: adminUser._id,
            prepTime: 25,
            cookTime: 20,
            servings: 2
        });

        const tarif6 = new Tarif({
            title: "Mücver",
            description: "Kabakla yapılan hafif ve lezzetli atıştırmalık.",
            ingredients: ["Kabak", "Yumurta", "Un", "Dereotu", "Taze soğan"],
            instructions: "1. 3 adet kabuğu soyulmuş kabağı rendenin kalın tarafıyla rendeleyin. Kabakların suyunu elinizle sıkarak iyice çıkarın (bu adım çıtırlık için çok önemlidir).\n2. İnce doğranmış dereotu, taze soğan ve maydanozu hazırlayın.\n3. Geniş bir kapta 2 adet yumurtayı hafifçe çırpın. Üzerine 3 yemek kaşığı un, kabaklar, yeşillikler, tuz, karabiber ve pul biberi ekleyip iyice karıştırarak homojen bir harç elde edin.\n4. Geniş bir tavaya zeytinyağı ekleyip kızdırın.\n5. Hazırladığınız harçtan birer yemek kaşığı alıp tavaya dökün ve hafifçe üzerlerine bastırarak yassılaştırın.\n6. Orta ateşte, arkalı önlü altın sarısı renk alana kadar yaklaşık 4-5 dakika kızartın. Kağıt havlu serili bir tabağa alıp fazla yağını süzdürün. Sarımsaklı yoğurt ile servis yapın.",
            category: kat5._id,
            author: testUser._id,
            prepTime: 20,
            cookTime: 15,
            servings: 4
        });

        await Tarif.insertMany([tarif1, tarif2, tarif3, tarif4, tarif5, tarif6]);
        console.log("[Sunucu] Mock veriler başarıyla eklendi.");
    } catch (error) {
        console.error(`[Sunucu] Mock Veri Ekleme Hatası: ${error.message}`);
    }
};