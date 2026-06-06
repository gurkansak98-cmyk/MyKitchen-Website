import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdPerson, MdRestaurantMenu, MdFavorite, MdSettings, MdAdd, MdDelete, MdEdit } from 'react-icons/md'
import { FaSpinner } from 'react-icons/fa'
import api from '../api'
import RecipeCard from '../components/RecipeCard'

function ProfilePage() {
    const navigate = useNavigate()
    const [user, setUser] = useState(() => {
        try { return JSON.parse(localStorage.getItem('user') || '{}') } catch { return {} }
    })
    const [activeTab, setActiveTab] = useState('recipes')
    const [myRecipes, setMyRecipes] = useState([])
    const [favorites, setFavorites] = useState([])
    const [loading, setLoading] = useState(true)
    const [newEmail, setNewEmail] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [updateMessage, setUpdateMessage] = useState('')
    const [updateError, setUpdateError] = useState('')
    const [showRecipeForm, setShowRecipeForm] = useState(false)
    const [editingRecipeId, setEditingRecipeId] = useState(null)

    // Tarif form state'i (Süre ve Porsiyon eklendi)
    const [recipeForm, setRecipeForm] = useState({
        title: '',
        description: '',
        ingredients: '',
        instructions: '',
        category: '',
        prepTime: '',
        cookTime: '',
        servings: '',
    })
    const [categories, setCategories] = useState([])
    const [recipeMessage, setRecipeMessage] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const recipesRes = await api.get('/recipes/my-recipes')
                setMyRecipes(recipesRes.data.data || [])
            } catch (err) {
                console.error('Tarifler çekilirken hata:', err)
            }

            try {
                const favoritesRes = await api.get('/recipes/favorites')
                setFavorites(favoritesRes.data.data || [])
            } catch (err) {
                console.error('Favoriler çekilirken hata:', err)
            }

            try {
                const categoriesRes = await api.get('/categories')
                setCategories(categoriesRes.data.data || [])
            } catch (err) {
                console.error('Kategoriler çekilirken hata:', err)
            }

            setLoading(false)
        }

        fetchData()

        window.addEventListener('userChanged', fetchData)
        return () => window.removeEventListener('userChanged', fetchData)
    }, [])

    const handleUpdateProfile = async (e) => {
        e.preventDefault()
        setUpdateMessage('')
        setUpdateError('')

        try {
            const updateData = {}
            if (newEmail) updateData.email = newEmail
            if (newPassword) updateData.password = newPassword

            if (Object.keys(updateData).length === 0) {
                setUpdateError('Güncellemek için en az bir alan doldurun.')
                return
            }

            const response = await api.put('/auth/update-profile', updateData)
            setUpdateMessage(response.data.message)

            if (newEmail) {
                const updatedUser = { ...user, email: newEmail }
                localStorage.setItem('user', JSON.stringify(updatedUser))
                setUser(updatedUser)
            }

            setNewEmail('')
            setNewPassword('')
        } catch (err) {
            setUpdateError(err.response?.data?.message || 'Güncelleme başarısız.')
        }
    }

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm(
            'Hesabınızı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!'
        )
        if (!confirmed) return
        try {
            await api.delete('/auth/delete-profile')
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.dispatchEvent(new Event('userChanged'))
            navigate('/')
        } catch (err) {
            setUpdateError(err.response?.data?.message || 'Hesap silinemedi.')
        }
    }

    const handleSaveRecipe = async (e) => {
        e.preventDefault()
        setRecipeMessage('')

        try {
            const ingredientsArray = typeof recipeForm.ingredients === 'string'
                ? recipeForm.ingredients.split(',').map((item) => item.trim()).filter((item) => item !== '')
                : recipeForm.ingredients

            const prepTime = parseInt(recipeForm.prepTime) || 0
            const cookTime = parseInt(recipeForm.cookTime) || 0
            const servings = parseInt(recipeForm.servings) || 1

            const payload = {
                ...recipeForm,
                ingredients: ingredientsArray,
                prepTime,
                cookTime,
                servings
            }

            if (editingRecipeId) {
                await api.put(`/recipes/${editingRecipeId}`, payload)
                setRecipeMessage('Tarif başarıyla güncellendi!')
            } else {
                await api.post('/recipes/create-recipe', payload)
                setRecipeMessage('Tarif başarıyla oluşturuldu!')
            }

            setRecipeForm({
                title: '',
                description: '',
                ingredients: '',
                instructions: '',
                category: '',
                prepTime: '',
                cookTime: '',
                servings: '',
            })
            setShowRecipeForm(false)
            setEditingRecipeId(null)

            const recipesRes = await api.get('/recipes/my-recipes')
            setMyRecipes(recipesRes.data.data || [])
        } catch (err) {
            setRecipeMessage(err.response?.data?.message || 'Tarif kaydedilemedi.')
        }
    }

    const handleEditRecipe = (recipe) => {
        setEditingRecipeId(recipe._id)
        setRecipeForm({
            title: recipe.title || '',
            description: recipe.description || '',
            ingredients: (recipe.ingredients || []).join(', '),
            instructions: recipe.instructions || '',
            category: recipe.category?._id || recipe.category || '',
            prepTime: recipe.prepTime || '',
            cookTime: recipe.cookTime || '',
            servings: recipe.servings || '',
        })
        setShowRecipeForm(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleDeleteRecipe = async (recipeId) => {
        const confirmed = window.confirm('Bu tarifi silmek istediğinizden emin misiniz?')
        if (!confirmed) return
        try {
            await api.delete(`/recipes/${recipeId}`)
            setMyRecipes(myRecipes.filter((r) => r._id !== recipeId))
        } catch (err) {
            console.error('Tarif silinemedi:', err)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20">
                <FaSpinner className="text-[48px] text-primary animate-spin" />
            </div>
        )
    }

    return (
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 pt-20 md:pt-24 pb-24 md:pb-0">
            <section className="bg-surface-container-high rounded-3xl p-8 mb-8">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <MdPerson className="text-[40px] text-on-primary" />
                    </div>
                    <div>
                        <h1 className="font-display text-[28px] md:text-[32px] font-bold text-on-surface">
                            {user.username}
                        </h1>
                        <p className="text-on-surface-variant">{user.email}</p>
                        <span className="inline-block mt-2 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full uppercase tracking-wider">
                            {user.role === 'admin' ? 'Admin' : 'Üye'}
                        </span>
                    </div>
                </div>
            </section>

            <div className="flex gap-2 mb-8 border-b border-outline-variant/30">
                <button
                    onClick={() => setActiveTab('recipes')}
                    className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'recipes'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-on-surface-variant hover:text-primary'
                        }`}
                >
                    <MdRestaurantMenu className="text-[18px]" />
                    Tariflerim ({myRecipes.length})
                </button>
                <button
                    onClick={() => setActiveTab('favorites')}
                    className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'favorites'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-on-surface-variant hover:text-primary'
                        }`}
                >
                    <MdFavorite className="text-[18px]" />
                    Favorilerim ({favorites.length})
                </button>
                <button
                    onClick={() => setActiveTab('settings')}
                    className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'settings'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-on-surface-variant hover:text-primary'
                        }`}
                >
                    <MdSettings className="text-[18px]" />
                    Ayarlar
                </button>
            </div>

            <div className="min-h-[550px]">
                {activeTab === 'recipes' && (
                <div>
                    <button
                        onClick={() => {
                            setShowRecipeForm(!showRecipeForm)
                            setEditingRecipeId(null)
                            setRecipeForm({
                                title: '',
                                description: '',
                                ingredients: '',
                                instructions: '',
                                category: '',
                                prepTime: '',
                                cookTime: '',
                                servings: '',
                            })
                        }}
                        className="mb-6 bg-primary text-on-primary text-sm font-semibold px-6 py-3 rounded-xl hover:bg-primary-container transition-colors shadow-md flex items-center gap-2"
                    >
                        <MdAdd className="text-xl" />
                        {showRecipeForm ? 'Formu Kapat' : 'Yeni Tarif Ekle'}
                    </button>

                    {recipeMessage && (
                        <div className="bg-tertiary-container/20 text-tertiary px-4 py-3 rounded-lg mb-6 text-sm">
                            {recipeMessage}
                        </div>
                    )}

                    {showRecipeForm && (
                        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_4px_12px_rgba(52,46,41,0.05)] mb-8">
                            <h3 className="font-display text-xl text-on-surface mb-4">
                                {editingRecipeId ? 'Tarifi Düzenle' : 'Yeni Tarif Oluştur'}
                            </h3>
                            <form onSubmit={handleSaveRecipe} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-on-surface mb-1">Tarif Adı</label>
                                    <input
                                        type="text"
                                        value={recipeForm.title}
                                        onChange={(e) => setRecipeForm({ ...recipeForm, title: e.target.value })}
                                        placeholder="Örn: Anneannemin Köftesi"
                                        className="w-full px-4 py-3 bg-surface-container rounded-xl border-none focus:ring-2 focus:ring-primary/50 outline-none text-on-surface"
                                        required
                                    />
                                </div>

                                {/* Süre ve Porsiyon Alanları */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-on-surface mb-1">Hazırlık Süresi (Dk)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={recipeForm.prepTime}
                                            onChange={(e) => setRecipeForm({ ...recipeForm, prepTime: e.target.value })}
                                            placeholder="Örn: 15"
                                            className="w-full px-4 py-3 bg-surface-container rounded-xl border-none focus:ring-2 focus:ring-primary/50 outline-none text-on-surface"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-on-surface mb-1">Pişirme Süresi (Dk)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={recipeForm.cookTime}
                                            onChange={(e) => setRecipeForm({ ...recipeForm, cookTime: e.target.value })}
                                            placeholder="Örn: 30"
                                            className="w-full px-4 py-3 bg-surface-container rounded-xl border-none focus:ring-2 focus:ring-primary/50 outline-none text-on-surface"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-on-surface mb-1">Porsiyon (Kişi)</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={recipeForm.servings}
                                            onChange={(e) => setRecipeForm({ ...recipeForm, servings: e.target.value })}
                                            placeholder="Örn: 4"
                                            className="w-full px-4 py-3 bg-surface-container rounded-xl border-none focus:ring-2 focus:ring-primary/50 outline-none text-on-surface"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-on-surface mb-1">Açıklama</label>
                                    <textarea
                                        value={recipeForm.description}
                                        onChange={(e) => setRecipeForm({ ...recipeForm, description: e.target.value })}
                                        placeholder="Tarifi kısaca tanımlayın"
                                        rows="3"
                                        className="w-full px-4 py-3 bg-surface-container rounded-xl border-none focus:ring-2 focus:ring-primary/50 outline-none text-on-surface resize-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-on-surface mb-1">Malzemeler</label>
                                    <textarea
                                        value={recipeForm.ingredients}
                                        onChange={(e) => setRecipeForm({ ...recipeForm, ingredients: e.target.value })}
                                        placeholder="Virgülle ayırın: 2 yumurta, 1 su bardağı un, ..."
                                        rows="3"
                                        className="w-full px-4 py-3 bg-surface-container rounded-xl border-none focus:ring-2 focus:ring-primary/50 outline-none text-on-surface resize-none"
                                        required
                                    />
                                    <p className="text-xs text-on-surface-variant mt-1">Her malzemeyi virgülle ayırarak yazın.</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-on-surface mb-1">Yapılış Talimatları</label>
                                    <textarea
                                        value={recipeForm.instructions}
                                        onChange={(e) => setRecipeForm({ ...recipeForm, instructions: e.target.value })}
                                        placeholder="Adım adım tarifi yazın..."
                                        rows="5"
                                        className="w-full px-4 py-3 bg-surface-container rounded-xl border-none focus:ring-2 focus:ring-primary/50 outline-none text-on-surface resize-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-on-surface mb-1">Kategori</label>
                                    <select
                                        value={recipeForm.category}
                                        onChange={(e) => setRecipeForm({ ...recipeForm, category: e.target.value })}
                                        className="w-full px-4 py-3 bg-surface-container rounded-xl border-none focus:ring-2 focus:ring-primary/50 outline-none text-on-surface"
                                        required
                                    >
                                        <option value="">Kategori seçin</option>
                                        {categories.map((cat) => (
                                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <button type="submit" className="bg-primary text-on-primary text-sm font-semibold px-8 py-3 rounded-xl hover:bg-primary-container transition-colors shadow-md">
                                    {editingRecipeId ? 'Değişiklikleri Kaydet' : 'Tarifi Kaydet'}
                                </button>
                            </form>
                        </div>
                    )}

                    {myRecipes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {myRecipes.map((recipe) => (
                                <div key={recipe._id} className="relative h-full">
                                    <RecipeCard recipe={recipe} />
                                    <div className="absolute top-2 left-2 flex flex-col gap-2 z-10">
                                        <button
                                            onClick={() => handleEditRecipe(recipe)}
                                            className="bg-primary text-on-primary p-2 rounded-full shadow-md hover:bg-primary-container transition-colors"
                                            title="Tarifi Düzenle"
                                        >
                                            <MdEdit className="text-lg" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteRecipe(recipe._id)}
                                            className="bg-error text-on-error p-2 rounded-full shadow-md hover:bg-error/80 transition-colors"
                                            title="Tarifi Sil"
                                        >
                                            <MdDelete className="text-lg" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-surface-container rounded-2xl">
                            <MdRestaurantMenu className="text-[48px] text-outline-variant mx-auto" />
                            <p className="text-on-surface-variant mt-4">Henüz tarif eklemediniz. Yukarıdaki butona tıklayarak ilk tarifinizi oluşturun!</p>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'favorites' && (
                <div>
                    {favorites.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {favorites.map((recipe) => (
                                <RecipeCard key={recipe._id} recipe={recipe} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-surface-container rounded-2xl">
                            <MdFavorite className="text-[48px] text-outline-variant mx-auto" />
                            <p className="text-on-surface-variant mt-4">Henüz favori tarifiniz yok. Tarifleri keşfederek beğendiklerinizi kaydedin!</p>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'settings' && (
                <div className="space-y-6">
                    <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-[0_4px_12px_rgba(52,46,41,0.05)]">
                        <h3 className="font-display text-2xl text-on-surface mb-6">Profil Güncelle</h3>
                        {updateMessage && <div className="bg-tertiary-container/20 text-tertiary px-4 py-3 rounded-lg mb-6 text-sm">{updateMessage}</div>}
                        {updateError && <div className="bg-error-container text-on-error-container px-4 py-3 rounded-lg mb-6 text-sm">{updateError}</div>}

                        <form onSubmit={handleUpdateProfile} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-on-surface mb-1">Yeni E-posta</label>
                                <input
                                    type="email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    placeholder={user.email}
                                    className="w-full px-4 py-3 bg-surface-container rounded-xl border-none focus:ring-2 focus:ring-primary/50 outline-none text-on-surface"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-on-surface mb-1">Yeni Şifre</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Yeni şifrenizi girin"
                                    className="w-full px-4 py-3 bg-surface-container rounded-xl border-none focus:ring-2 focus:ring-primary/50 outline-none text-on-surface"
                                />
                            </div>
                            <button type="submit" className="bg-primary text-on-primary text-sm font-semibold px-8 py-3 rounded-xl hover:bg-primary-container transition-colors shadow-md">
                                Değişiklikleri Kaydet
                            </button>
                        </form>
                    </div>

                    <div className="bg-error-container/5 rounded-2xl p-6 border border-error/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <p className="text-on-surface font-semibold mb-1">Hesabınızı Silin</p>
                            <p className="text-on-surface-variant text-sm">Hesabınızı sildiğinizde tüm verileriniz kalıcı olarak silinecektir. Bu işlem geri alınamaz.</p>
                        </div>
                        <button onClick={handleDeleteAccount} className="bg-error text-on-error text-sm font-semibold px-6 py-3 rounded-xl hover:bg-error/80 transition-colors flex-shrink-0">
                            Hesabımı Sil
                        </button>
                    </div>
                </div>
            )}
            </div>
        </div>
    )
}

export default ProfilePage
