import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { MdSearch, MdPerson, MdHome, MdFavorite, MdLogin, MdRestaurantMenu, MdAdminPanelSettings } from 'react-icons/md'

function Navbar() {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user')
        if (savedUser) {
            try {
                return JSON.parse(savedUser)
            } catch {
                return null
            }
        }
        return null
    })
    const navigate = useNavigate()
    const location = useLocation()
    const [searchParams, setSearchParams] = useSearchParams()

    const searchQuery = searchParams.get('search') || ''

    const handleSearchChange = (e) => {
        const value = e.target.value
        if (location.pathname !== '/recipes') {
            navigate(`/recipes?search=${encodeURIComponent(value)}`)
        } else {
            if (value) {
                setSearchParams({ search: value })
            } else {
                setSearchParams({})
            }
        }
    }

    useEffect(() => {
        const handleStorageChange = () => {
            const savedUser = localStorage.getItem('user')
            if (savedUser) {
                try { setUser(JSON.parse(savedUser)) } catch { setUser(null) }
            } else {
                setUser(null)
            }
        }
        window.addEventListener('storage', handleStorageChange)
        window.addEventListener('userChanged', handleStorageChange)
        return () => {
            window.removeEventListener('storage', handleStorageChange)
            window.removeEventListener('userChanged', handleStorageChange)
        }
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
        window.dispatchEvent(new Event('userChanged'))
        navigate('/')
    }

    // Mobil nav için aktif kontrol
    const isActive = (path) => location.pathname === path

    return (
        <>
            {/* Desktop Navbar */}
            <nav className="hidden md:flex fixed top-0 w-full z-50 justify-between items-center px-10 h-20 max-w-[1280px] mx-auto left-0 right-0 bg-surface/80 backdrop-blur-md shadow-sm transition-all duration-300">
                <div className="flex items-center gap-8">
                    <Link to="/" className="font-display text-2xl font-bold text-primary">
                        MyKitchen
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link
                            to="/"
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${location.pathname === '/'
                                    ? 'bg-primary text-white shadow-sm'
                                    : 'text-primary hover:bg-primary/5'
                                }`}
                        >
                            Ana Sayfa
                        </Link>
                        <Link
                            to="/recipes"
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${location.pathname === '/recipes'
                                    ? 'bg-primary text-white shadow-sm'
                                    : 'text-primary hover:bg-primary/5'
                                }`}
                        >
                            Tarifler
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative flex items-center">
                        <MdSearch className="absolute left-3 text-on-surface-variant text-xl" />
                        <input
                            type="text"
                            placeholder="Tarif ara..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="bg-surface-container pl-10 pr-4 py-2 rounded-full border-none focus:ring-2 focus:ring-primary outline-none text-base w-64 transition-all focus:w-72"
                        />
                    </div>

                    {!user ? (
                        <>
                            <Link
                                to="/login"
                                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${location.pathname === '/login'
                                        ? 'bg-primary text-white shadow-sm'
                                        : 'text-primary hover:bg-primary/5'
                                    }`}
                            >
                                Giriş Yap
                            </Link>
                            <Link
                                to="/register"
                                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${location.pathname === '/register'
                                        ? 'bg-primary text-white shadow-sm'
                                        : 'text-primary hover:bg-primary/5'
                                    }`}
                            >
                                Hemen Katıl
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/profile"
                                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-1 ${location.pathname === '/profile'
                                        ? 'bg-primary text-white shadow-sm'
                                        : 'text-primary hover:bg-primary/5'
                                    }`}
                            >
                                <MdPerson className="text-xl" />
                                {user.username}
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 rounded-full text-sm font-semibold text-primary hover:bg-primary/5 transition-all duration-200"
                            >
                                Çıkış
                            </button>
                        </>
                    )}
                </div>
            </nav>

            {/* Mobil Üst Bar */}
            <header className="md:hidden fixed top-0 w-full z-40 bg-surface/90 backdrop-blur-sm h-14 flex items-center justify-center border-b border-surface-container">
                <Link to="/" className="font-display text-2xl text-primary font-bold">
                    MyKitchen
                </Link>
            </header>

            {/* Mobil Alt Navigasyon */}
            <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-surface shadow-[0_-4px_12px_rgba(52,46,41,0.05)] border-t border-outline-variant/20">
                <div className="flex justify-around items-center h-16 px-2">
                    <Link
                        to="/"
                        className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] py-1 rounded-xl transition-colors ${isActive('/') ? 'text-primary' : 'text-on-surface-variant'
                            }`}
                    >
                        <MdHome className="text-2xl" />
                        <span className="text-[10px] font-medium">Ana Sayfa</span>
                    </Link>

                    <Link
                        to="/recipes"
                        className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] py-1 rounded-xl transition-colors ${isActive('/recipes') ? 'text-primary' : 'text-on-surface-variant'
                            }`}
                    >
                        <MdRestaurantMenu className="text-2xl" />
                        <span className="text-[10px] font-medium">Tarifler</span>
                    </Link>

                    {!user ? (
                        <Link
                            to="/login"
                            className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] py-1 rounded-xl transition-colors ${isActive('/login') ? 'text-primary' : 'text-on-surface-variant'
                                }`}
                        >
                            <MdLogin className="text-2xl" />
                            <span className="text-[10px] font-medium">Giriş</span>
                        </Link>
                    ) : (
                        <>
                            <Link
                                to="/profile"
                                className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] py-1 rounded-xl transition-colors ${isActive('/profile') ? 'text-primary' : 'text-on-surface-variant'
                                    }`}
                            >
                                <MdFavorite className="text-2xl" />
                                <span className="text-[10px] font-medium">Favoriler</span>
                            </Link>

                            {user.role === 'admin' && (
                                <Link
                                    to="/admin"
                                    className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] py-1 rounded-xl transition-colors ${isActive('/admin') ? 'text-primary' : 'text-on-surface-variant'
                                        }`}
                                >
                                    <MdAdminPanelSettings className="text-2xl" />
                                    <span className="text-[10px] font-medium">Admin</span>
                                </Link>
                            )}

                            <Link
                                to="/profile"
                                className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] py-1 rounded-xl transition-colors ${isActive('/profile') ? 'text-primary' : 'text-on-surface-variant'
                                    }`}
                            >
                                <MdPerson className="text-2xl" />
                                <span className="text-[10px] font-medium">Profil</span>
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </>
    )
}

export default Navbar
