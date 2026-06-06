# BLG330 Dönem Projesi: Kapsamlı Backend ve Veritabanı Dokümantasyonu

[cite_start]Bu doküman, Node.js ve Express.js kullanılarak geliştirilecek MERN Stack (MongoDB, Express.js, React.js, Node.js) tabanlı Yemek Tarif Paylaşım Platformu'nun arka uç (backend) ve veritabanı (database) mimarisini açıklamaktadır[cite: 6, 10, 50].

## 1. Mimari ve Sistem Gereksinimleri

[cite_start]Proje, RESTful API standartlarına uygun olarak MVC (Model-View-Controller) mimarisi ile tasarlanmıştır[cite: 11].

- [cite_start]**Yönlendirme (Routing):** Router yapısı ile modüler uç nokta (endpoint) yönetimi sağlanacaktır[cite: 12].
- [cite_start]**Ara Katman (Middleware):** Hata yönetimi (error handling), loglama (logging) ve CORS işlemleri için middleware kullanılacaktır[cite: 13]. [cite_start]Ortam değişkenleri (environment variables) `.env` dosyası ile yönetilecektir[cite: 13].
- [cite_start]**Kimlik Doğrulama (Authentication) ve Yetkilendirme (Authorization):** JWT (JSON Web Token) kullanılarak güvenli kimlik doğrulama sistemi kurulacaktır[cite: 26, 27]. [cite_start]Şifreler veritabanına kaydedilmeden önce bcrypt kütüphanesi ile şifrelenecektir (hashing)[cite: 29].
- [cite_start]**Erişim Kontrolü:** Korumalı rotalar (protected routes) oluşturulacak ve rol tabanlı erişim kontrolü (Role-Based Access Control) ile 'admin' ve 'user' yetkileri ayrıştırılacaktır[cite: 30, 31].
- **Başlangıç Verileri (Seeding):** Sistem ayağa kalktığında test amaçlı 1 admin, 1 standart kullanıcı ve 6 adet örnek (mock) yemek tarifi veritabanına otomatik olarak eklenecektir.

---

## 2. Veritabanı Modelleri (MongoDB & Mongoose)

[cite_start]Mongoose kullanılarak 3 farklı model tanımlanmıştır[cite: 23]. [cite_start]Modeller arası ilişkiler `ref` ve `populate` yöntemleri kullanılarak kurulmuştur[cite: 24]. [cite_start]Veri doğrulama (validation) kuralları şemalarda (schemas) katı bir şekilde uygulanmıştır[cite: 25].

### A. User (Kullanıcı) Modeli

Sistemdeki hesapları ve yetkileri yönetir.

- `username`: String, zorunlu (required), benzersiz (unique).
- `email`: String, zorunlu, benzersiz, geçerli bir e-posta formatında olmalıdır.
- [cite_start]`password`: String, zorunlu (bcrypt ile hashlenmiş formatta saklanır)[cite: 29].
- `role`: String, enum: `['user', 'admin']`, varsayılan (default): `'user'`.

### B. Recipe (Tarif) Modeli

Yemek tariflerinin tüm detaylarını tutar. [cite_start]Oluşturma, Okuma, Güncelleme, Silme (CRUD) işlemleri bu model üzerinde yoğunlaşır[cite: 23].

- `title`: String, zorunlu.
- `description`: String, zorunlu.
- `ingredients`: Array of Strings (Dizi), zorunlu.
- `instructions`: String, zorunlu.
- [cite_start]`author`: ObjectId, referans: `'User'`[cite: 24].
- [cite_start]`category`: ObjectId, referans: `'Category'`[cite: 24].

### C. Category (Kategori) Modeli

Tariflerin sınıflandırılması için kullanılır.

- `name`: String, zorunlu, benzersiz.
- `description`: String.

---

## 3. API Rotaları (Routes) ve Uç Noktalar

[cite_start]Sistemde GET, POST, PUT, DELETE metotlarını içeren en az 4 farklı endpoint yapısı eksiksiz olarak kullanılmıştır[cite: 11].

### A. Auth ve Kullanıcı Rotaları (`/api/auth`)

[cite_start]Kullanıcı kayıt ve giriş işlevlerini barındırır[cite: 28].

- **POST `/api/auth/register` (Kayıt Ol)**
  - İşlev: Yeni bir kullanıcı oluşturur.
  - Beklenen Veri (Body): `username`, `email`, `password`.
- **POST `/api/auth/login` (Giriş Yap)**
  - İşlev: Kullanıcı bilgilerini doğrular ve JWT token döndürür.
  - Beklenen Veri (Body): `email`, `password`.
- **PUT `/api/auth/update` (Hesap Güncelle)**
  - İşlev: Kullanıcının kendi profil bilgilerini veya şifresini günceller.
  - [cite_start]Yetki: Korumalı Rota (Sadece geçerli JWT token'a sahip kullanıcı)[cite: 30].
- **DELETE `/api/auth/delete` (Hesap Sil)**
  - İşlev: Kullanıcının sistemdeki kendi hesabını siler.
  - [cite_start]Yetki: Korumalı Rota (Sadece giriş yapmış kullanıcı)[cite: 30].

### B. Tarif Rotaları (`/api/recipes`)

[cite_start]Tarifler üzerindeki tüm CRUD işlemlerini yönetir[cite: 23].

- **GET `/api/recipes`**
  - İşlev: Veritabanındaki tüm tarifleri (6 adet mock veri dahil) listeler. [cite_start]`populate` ile yazar ve kategori verilerini birleştirerek döndürür[cite: 24].
  - Yetki: Herkese Açık (Public).
- **GET `/api/recipes/:id`**
  - İşlev: Belirtilen ID'ye sahip tek bir tarifin detaylarını getirir.
  - Yetki: Herkese Açık.
- **POST `/api/recipes`**
  - İşlev: Yeni bir yemek tarifi oluşturur.
  - Beklenen Veri (Body): `title`, `description`, `ingredients`, `instructions`, `category`.
  - [cite_start]Yetki: Korumalı Rota (Sadece giriş yapmış kullanıcılar veya admin)[cite: 30].
- **PUT `/api/recipes/:id`**
  - İşlev: Mevcut bir tarifi günceller.
  - [cite_start]Yetki: Korumalı Rota (Sadece tarifi oluşturan asıl yazar veya admin yetkisine sahip kullanıcı)[cite: 30, 31].
- **DELETE `/api/recipes/:id`**
  - İşlev: Belirtilen tarifi sistemden kalıcı olarak siler.
  - [cite_start]Yetki: Korumalı Rota (Sadece tarifi oluşturan asıl yazar veya admin)[cite: 30, 31].

### C. Kategori Rotaları (`/api/categories`)

Tarif kategorilerini yönetir.

- **GET `/api/categories`**
  - İşlev: Sistemdeki tüm kategorileri listeler.
  - Yetki: Herkese Açık.
- **POST `/api/categories`**
  - İşlev: Yeni bir kategori ekler.
  - [cite_start]Yetki: Korumalı Rota (Sadece admin yetkisine sahip kullanıcı)[cite: 30, 31].
- **DELETE `/api/categories/:id`**
  - İşlev: Belirtilen kategoriyi siler.
  - [cite_start]Yetki: Korumalı Rota (Sadece admin yetkisine sahip kullanıcı)[cite: 30, 31].
