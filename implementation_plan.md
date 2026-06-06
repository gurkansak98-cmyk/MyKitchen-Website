# Heirloom Kitchen — Frontend Kurulumu (Vite + React)

Mevcut MERN Stack backend'e uyumlu, Vite + React + TailwindCSS tabanlı frontend uygulamasının sıfırdan kurulumu.

## Genel Yaklaşım

- **Basit ve anlaşılır kod** — Hiç bilmeyen biri için yazılmış gibi, sade ve açık
- **Backend API ile birebir uyumlu** — Mevcut `/api/auth`, `/api/recipes`, `/api/categories` endpoint'leri kullanılacak
- **TailwindCSS** — Sağladığın HTML tasarımlarındaki aynı Tailwind config ve renk paleti kullanılacak
- **Axios** — API istekleri için, basit bir merkezi yapılandırma ile

---

## Faz 1: Proje Kurulumu

### 1.1 Vite + React Oluşturma
```bash
cd frontend
npx -y create-vite@latest ./ --template react
npm install
```

### 1.2 Bağımlılıklar
```bash
npm install axios react-router-dom
npm install -D tailwindcss @tailwindcss/vite
```

### 1.3 TailwindCSS Yapılandırması
- `vite.config.js` — TailwindCSS Vite plugin eklenmesi
- `src/index.css` — Tailwind import + Custom renk paleti (sağlanan HTML'deki tema renkleri)

### 1.4 Axios Yapılandırması

#### [NEW] [api.js](file:///c:/Users/adil/Documents/My%20Projects/WebProjem/frontend/src/api.js)
- `baseURL: "http://localhost:3000/api"` (backend portu)
- Request interceptor: localStorage'dan token'ı alıp `Authorization: Bearer <token>` header'ına ekler
- Response interceptor: 401 hatalarında otomatik logout

---

## Faz 2: Temel Yapı ve Routing

### 2.1 Sayfa Yapısı (React Router)

| Yol | Sayfa | Açıklama |
|-----|-------|----------|
| `/` | Ana Sayfa | Kategoriler, trend tarifler, CTA |
| `/login` | Giriş | Email/şifre ile giriş |
| `/register` | Kayıt | Yeni hesap oluşturma |
| `/recipe/:id` | Tarif Detay | Tekil tarif görüntüleme |
| `/profile` | Kullanıcı Paneli | Profil, tariflerim, favoriler |

### 2.2 Dosya Yapısı

```
frontend/src/
├── api.js                    # Axios instance
├── App.jsx                   # Router tanımları
├── main.jsx                  # Entry point
├── index.css                 # Tailwind + Custom stiller
├── components/
│   ├── Navbar.jsx            # Üst navigasyon (desktop + mobile)
│   ├── Footer.jsx            # Alt bilgi
│   ├── RecipeCard.jsx        # Tarif kartı bileşeni
│   └── ProtectedRoute.jsx    # Giriş gerektiren sayfa koruması
└── pages/
    ├── HomePage.jsx           # Ana sayfa
    ├── LoginPage.jsx          # Giriş sayfası
    ├── RegisterPage.jsx       # Kayıt sayfası
    ├── RecipeDetailPage.jsx   # Tarif detay
    └── ProfilePage.jsx        # Kullanıcı paneli
```

---

## Faz 3: Login & Register Sayfaları

### [NEW] [LoginPage.jsx](file:///c:/Users/adil/Documents/My%20Projects/WebProjem/frontend/src/pages/LoginPage.jsx)
- `username` ve `password` input alanları
- `POST /api/auth/login` → token + user bilgisi localStorage'a kayıt
- Başarılı girişte ana sayfaya yönlendirme
- Hata mesajı gösterimi

### [NEW] [RegisterPage.jsx](file:///c:/Users/adil/Documents/My%20Projects/WebProjem/frontend/src/pages/RegisterPage.jsx)
- `username`, `email`, `password` input alanları
- `POST /api/auth/register` → token + user bilgisi localStorage'a kayıt
- Başarılı kayıtta ana sayfaya yönlendirme

---

## Faz 4: Ana Sayfa

### [NEW] [HomePage.jsx](file:///c:/Users/adil/Documents/My%20Projects/WebProjem/frontend/src/pages/HomePage.jsx)
- Sağlanan HTML tasarımının React'e dönüştürülmüş hali
- `GET /api/categories` → Popüler Kategoriler grid'i
- `GET /api/recipes` → Trend Tarifler kartları
- CTA (Tarif Paylaş) bölümü
- Görseller: Sağlanan HTML'deki Google hosted görseller aynen kullanılacak

---

## Faz 5: Tarif Detay Sayfası

### [NEW] [RecipeDetailPage.jsx](file:///c:/Users/adil/Documents/My%20Projects/WebProjem/frontend/src/pages/RecipeDetailPage.jsx)
- `GET /api/recipes/:id` ile tarif verisini çeker
- Hero görsel, başlık, açıklama, süre/porsiyon bilgileri
- Malzemeler ve yapılış talimatları
- Puan verme (`POST /api/recipes/rate/:id`)
- Favorileme (`POST /api/recipes/favorite/:id`)

---

## Faz 6: Kullanıcı Paneli

### [NEW] [ProfilePage.jsx](file:///c:/Users/adil/Documents/My%20Projects/WebProjem/frontend/src/pages/ProfilePage.jsx)
- Profil bilgileri görüntüleme
- Tariflerim (`GET /api/recipes/my-recipes`)
- Favorilerim (`GET /api/recipes/favorites`)
- Profil güncelleme (`PUT /api/auth/update-profile`)
- Hesap silme (`DELETE /api/auth/delete-profile`)

---

## Vite Proxy Ayarı

> [!IMPORTANT]
> Development ortamında CORS sorunlarını önlemek için `vite.config.js`'de proxy ayarı yapılacak:
> ```js
> server: {
>   proxy: {
>     '/api': 'http://localhost:3000'
>   }
> }
> ```
> Bu sayede frontend `http://localhost:5173/api/...` isteklerini otomatik olarak backend'e yönlendirecek.

---

## Verification Plan

### Automated Tests
- `npm run dev` ile frontend ayağa kaldırılacak
- Backend çalışırken login/register formları test edilecek
- Sayfa routing'i doğrulanacak

### Manual Verification
- Browser'da tüm sayfalara gezinme
- Login → Ana Sayfa → Tarif Detay akışı
- Register → otomatik giriş akışı
