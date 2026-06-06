import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MdFavorite, MdFavoriteBorder, MdPerson, MdChecklist, MdShoppingBasket, MdMenuBook, MdRestaurantMenu, MdError, MdSchedule, MdLocalDining, MdPeople } from 'react-icons/md'
import { FaStar, FaRegStar, FaSpinner } from 'react-icons/fa'
import api from '../api'

function RecipeDetailPage() {
    const { id } = useParams()
    const [recipe, setRecipe] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [ratingMessage, setRatingMessage] = useState('')
    const [user, setUser] = useState(() => {
        try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
    })

    useEffect(() => {
        const handleUserChange = () => {
            setUser(JSON.parse(localStorage.getItem('user')))
        }
        window.addEventListener('userChanged', handleUserChange)
        return () => window.removeEventListener('userChanged', handleUserChange)
    }, [])

    const isFavorited = user?.favorites?.includes(id)

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await api.get(`/recipes/${id}`)
                setRecipe(response.data.data)
            } catch {
                setError('Tarif bulunamadı.')
            } finally {
                setLoading(false)
            }
        }
        fetchRecipe()
    }, [id])

    const myRating = (recipe && user) ? recipe.ratings?.find(
        (r) => (r.user?._id || r.user) === user.id || (r.user?._id || r.user) === user._id
    ) : null;
    const ratingScore = myRating ? myRating.score : 0;

    const handleRate = async (score) => {
        if (!user) {
            setRatingMessage('Puan vermek için giriş yapmalısınız.')
            return
        }
        try {
            await api.post(`/recipes/rate/${id}`, { score })
            setRatingMessage('Puanınız kaydedildi!')
            const response = await api.get(`/recipes/${id}`)
            setRecipe(response.data.data)
        } catch (err) {
            setRatingMessage(err.response?.data?.message || 'Puan verilemedi.')
        }
    }

    const handleFavorite = async () => {
        if (!user) {
            alert("Favorilere eklemek için lütfen giriş yapın.")
            return
        }
        try {
            await api.post(`/recipes/favorite/${id}`)

            const currentFavorites = user.favorites || []
            const updatedFavorites = isFavorited
                ? currentFavorites.filter(favId => favId !== id)
                : [...currentFavorites, id]

            const updatedUser = { ...user, favorites: updatedFavorites }
            localStorage.setItem('user', JSON.stringify(updatedUser))
            setUser(updatedUser)
            window.dispatchEvent(new Event('userChanged'))
        } catch (err) {
            console.error('Favori işlemi hatası:', err)
            alert('İşlem başarısız oldu.')
        }
    }

    const averageRating = recipe?.ratings?.length > 0
        ? (recipe.ratings.reduce((sum, r) => sum + r.score, 0) / recipe.ratings.length).toFixed(1)
        : 'Henüz puan yok'

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20">
                <FaSpinner className="text-[48px] text-primary animate-spin" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center pt-20 gap-4">
                <MdError className="text-[48px] text-error" />
                <p className="text-on-surface-variant">{error}</p>
                <Link to="/" className="text-primary font-semibold hover:text-primary-container">
                    Ana Sayfaya Dön
                </Link>
            </div>
        )
    }

    return (
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 pt-20 md:pt-24 pb-24 md:pb-0">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <article className="col-span-1 lg:col-span-8 space-y-8">
                    <section className="space-y-6">
                        <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(52,46,41,0.05)] group bg-surface-container-high">
                            <div className="w-full h-full flex items-center justify-center">
                                <MdRestaurantMenu className="text-[96px] text-outline-variant" />
                            </div>

                            <button
                                onClick={handleFavorite}
                                className="absolute top-4 right-4 bg-surface/90 backdrop-blur-sm p-3 rounded-full text-on-surface hover:text-primary transition-colors shadow-sm"
                                title={isFavorited ? "Favorilerden Çıkar" : "Favorilere Ekle"}
                            >
                                {isFavorited ? <MdFavorite className="text-2xl text-primary" /> : <MdFavoriteBorder className="text-2xl" />}
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                                {recipe.category && (
                                    <span className="px-3 py-1 bg-secondary-container/50 text-on-secondary-container text-xs font-medium rounded-full">
                                        {recipe.category.name}
                                    </span>
                                )}
                            </div>

                            <h1 className="font-display text-[28px] md:text-[48px] leading-[1.2] font-bold text-on-surface">
                                {recipe.title}
                            </h1>

                            <div className="flex items-center gap-4 text-on-surface-variant">
                                <div className="flex items-center gap-1 text-primary">
                                    {[1, 2, 3, 4, 5].map((star) => {
                                        const filled = (ratingScore || (parseFloat(averageRating) || 0)) >= star
                                        return filled ? (
                                            <FaStar key={star} className="text-xl cursor-pointer hover:scale-110 transition-transform" onClick={() => handleRate(star)} />
                                        ) : (
                                            <FaRegStar key={star} className="text-xl cursor-pointer hover:scale-110 transition-transform" onClick={() => handleRate(star)} />
                                        )
                                    })}
                                    <span className="ml-2 text-on-surface-variant text-sm">
                                        ({averageRating}) — {recipe.ratings?.length || 0} değerlendirme
                                    </span>
                                </div>
                            </div>

                            {ratingMessage && (
                                <p className="text-sm text-tertiary font-medium">{ratingMessage}</p>
                            )}

                            <p className="text-lg text-on-surface-variant max-w-3xl">
                                {recipe.description}
                            </p>

                            {/* SÜRE VE PORSİYON BİLGİLERİ */}
                            <div className="flex flex-wrap gap-6 pt-4 border-t border-outline-variant/30">
                                <div className="flex items-center gap-2">
                                    <MdSchedule className="text-primary text-2xl" />
                                    <div>
                                        <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                                            Hazırlık
                                        </p>
                                        <p className="font-medium text-on-surface">
                                            {recipe.prepTime ? `${recipe.prepTime} dk` : '-'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MdLocalDining className="text-primary text-2xl" />
                                    <div>
                                        <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                                            Pişirme
                                        </p>
                                        <p className="font-medium text-on-surface">
                                            {recipe.cookTime ? `${recipe.cookTime} dk` : '-'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MdPeople className="text-primary text-2xl" />
                                    <div>
                                        <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                                            Porsiyon
                                        </p>
                                        <p className="font-medium text-on-surface">
                                            {recipe.servings ? `${recipe.servings} Kişilik` : '-'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* YAZAR VE MALZEME BİLGİLERİ */}
                            <div className="flex flex-wrap gap-6 pt-4 border-t border-outline-variant/30">
                                <div className="flex items-center gap-2">
                                    <MdPerson className="text-primary text-2xl" />
                                    <div>
                                        <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                                            Yazar
                                        </p>
                                        <p className="font-medium text-on-surface">
                                            {recipe.author?.username || 'Anonim'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MdChecklist className="text-primary text-2xl" />
                                    <div>
                                        <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                                            Malzeme
                                        </p>
                                        <p className="font-medium text-on-surface">
                                            {recipe.ingredients?.length || 0} adet
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </article>

                <aside className="col-span-1 lg:col-span-4 space-y-6">
                    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_4px_12px_rgba(52,46,41,0.05)]">
                        <h2 className="font-display text-xl text-on-surface mb-4 flex items-center gap-2">
                            <MdShoppingBasket className="text-primary text-2xl" />
                            Malzemeler
                        </h2>
                        <ul className="space-y-3">
                            {recipe.ingredients?.map((ingredient, index) => (
                                <li
                                    key={index}
                                    className="flex items-start gap-3 text-on-surface-variant"
                                >
                                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                                        {index + 1}
                                    </span>
                                    <span>{ingredient}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_4px_12px_rgba(52,46,41,0.05)]">
                        <h2 className="font-display text-xl text-on-surface mb-4 flex items-center gap-2">
                            <MdMenuBook className="text-primary text-2xl" />
                            Yapılış
                        </h2>
                        <div className="text-on-surface-variant whitespace-pre-line leading-relaxed">
                            {recipe.instructions}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}

export default RecipeDetailPage
