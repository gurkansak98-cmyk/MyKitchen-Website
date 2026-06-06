import { Routes, Route } from 'react-router-dom'

// Ortak Bileşenler
import ProtectedRoute from './components/ProtectedRoute'
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'

// Sayfalar
import HomePage from './pages/HomePage'
import RecipesPage from './pages/RecipesPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import RecipeDetailPage from './pages/RecipeDetailPage'
import ProfilePage from './pages/ProfilePage'
import AdminPage from './pages/AdminPage'

function App() {
    return (
        <Routes>
            {/* Kimlik Doğrulama Sayfaları (Kendi Layout'una sahip) */}
            <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Genel Sayfalar (Navbar ve Footer İçerir) */}
            <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/recipes" element={<RecipesPage />} />
                <Route path="/recipe/:id" element={<RecipeDetailPage />} />
                
                {/* Korumalı profil sayfası */}
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    }
                />
            </Route>

            {/* Admin Paneli (Kendi Layout'una sahip) */}
            <Route
                path="/admin"
                element={
                    <ProtectedRoute>
                        <AdminPage />
                    </ProtectedRoute>
                }
            />
        </Routes>
    )
}

export default App
