import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FaSpinner } from 'react-icons/fa'
import { MdMenuBook } from 'react-icons/md'
import api from '../api'
import RecipeCard from '../components/RecipeCard'

function RecipesPage() {
    const [recipes, setRecipes] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchParams, setSearchParams] = useSearchParams()

    const searchQuery = searchParams.get('search') || ''
    const selectedCategoryId = searchParams.get('category') || 'all'

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [recipesRes, categoriesRes] = await Promise.all([
                    api.get('/recipes'),
                    api.get('/categories'),
                ])
                setRecipes(recipesRes.data.data)
                setCategories(categoriesRes.data.data)
            } catch (err) {
                console.error('Veri çekilirken hata:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const handleCategorySelect = (categoryId) => {
        const newParams = new URLSearchParams(searchParams)
        if (categoryId === 'all') {
            newParams.delete('category')
        } else {
            newParams.set('category', categoryId)
        }
        setSearchParams(newParams)
    }

    const filteredRecipes = recipes.filter(recipe => {
        // Arama kelimesi filtresi
        let matchesSearch = true
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            matchesSearch =
                recipe.title?.toLowerCase().includes(query) ||
                recipe.description?.toLowerCase().includes(query) ||
                recipe.ingredients?.some(ing => ing.toLowerCase().includes(query))
        }

        // Kategori filtresi
        let matchesCategory = true
        if (selectedCategoryId !== 'all') {
            matchesCategory = recipe.category?._id === selectedCategoryId
        }

        return matchesSearch && matchesCategory
    })

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20">
                <div className="text-center">
                    <FaSpinner className="text-[48px] text-primary animate-spin mx-auto" />
                    <p className="text-on-surface-variant mt-4">Yükleniyor...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 pt-28 pb-24 md:pb-0 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h1 className="font-display text-[40px] font-bold text-on-surface leading-tight">
                        Tarifler
                    </h1>
                    <p className="text-on-surface-variant mt-2">
                        İlham verici yemek tariflerini keşfedin
                    </p>
                </div>
            </div>

            {/* Kategori Filtreleme Çubuğu */}
            <div className="flex overflow-x-auto pb-4 mb-6 gap-3 hide-scrollbar">
                <button
                    onClick={() => handleCategorySelect('all')}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${selectedCategoryId === 'all'
                            ? 'bg-primary text-white shadow-md'
                            : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                        }`}
                >
                    Tümü
                </button>
                {categories.map(category => (
                    <button
                        key={category._id}
                        onClick={() => handleCategorySelect(category._id)}
                        className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${selectedCategoryId === category._id
                                ? 'bg-primary text-white shadow-md'
                                : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                            }`}
                    >
                        {category.name}
                    </button>
                ))}
            </div>

            {/* Tarif Listesi */}
            {filteredRecipes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {filteredRecipes.map((recipe) => (
                        <RecipeCard key={recipe._id} recipe={recipe} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-surface-container rounded-3xl border border-outline-variant/20 mb-12">
                    <MdMenuBook className="text-[64px] text-outline-variant/50 mx-auto mb-4" />
                    <h3 className="font-display text-2xl text-on-surface mb-2">Sonuç Bulunamadı</h3>
                    <p className="text-on-surface-variant max-w-md mx-auto">
                        {searchQuery
                            ? `"${searchQuery}" aramasına ve seçilen kategoriye uygun tarif bulunamadı.`
                            : 'Bu kategoride henüz tarif eklenmemiş.'}
                    </p>
                </div>
            )}
        </div>
    )
}

export default RecipesPage
