import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MdPerson, MdLock, MdError } from 'react-icons/md'
import { FaSpinner } from 'react-icons/fa'
import api from '../api'

function LoginPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/')
        }
    }, [navigate])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!username || !password) {
            setError('Lütfen kullanıcı adı ve şifrenizi girin.')
            return
        }
        setLoading(true)
        setError('')
        try {
            const response = await api.post('/auth/login', { username, password })
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('user', JSON.stringify(response.data.user))
            window.dispatchEvent(new Event('userChanged'))

            if (response.data.user.role === 'admin') {
                navigate('/admin')
            } else {
                navigate('/')
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Giriş sırasında bir hata oluştu.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-surface-container-lowest rounded-2xl shadow-[0_8px_24px_rgba(52,46,41,0.1)] p-8 md:p-10">
            <div className="text-center mb-8">
                <h1 className="font-display text-2xl text-on-surface">Giriş Yap</h1>
                <p className="text-on-surface-variant mt-2">Hesabınıza giriş yaparak tarifleri keşfedin</p>
            </div>

                    {error && (
                        <div className="bg-error-container text-on-error-container px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2">
                            <MdError className="text-xl shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-on-surface mb-2">
                                Kullanıcı Adı
                            </label>
                            <div className="relative flex items-center">
                                <MdPerson className="absolute left-3 text-on-surface-variant text-xl" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Kullanıcı adınızı girin"
                                    className="w-full pl-10 pr-4 py-3 bg-surface-container rounded-xl border-none focus:ring-2 focus:ring-primary/50 outline-none transition-all text-on-surface"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-on-surface mb-2">
                                Şifre
                            </label>
                            <div className="relative flex items-center">
                                <MdLock className="absolute left-3 text-on-surface-variant text-xl" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Şifrenizi girin"
                                    className="w-full pl-10 pr-4 py-3 bg-surface-container rounded-xl border-none focus:ring-2 focus:ring-primary/50 outline-none transition-all text-on-surface"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-on-primary font-semibold py-3 rounded-xl hover:bg-primary-container transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <FaSpinner className="animate-spin text-xl" />
                                    Giriş yapılıyor...
                                </>
                            ) : (
                                'Giriş Yap'
                            )}
                        </button>
                    </form>

                    <p className="text-center text-on-surface-variant mt-6">
                        Hesabınız yok mu?{' '}
                        <Link to="/register" className="text-primary font-semibold hover:text-primary-container transition-colors">
                            Hemen Katıl
                        </Link>
                    </p>
                </div>
    )
}

export default LoginPage
