import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MdFavoriteBorder, MdFavorite, MdPerson, MdChecklist, MdRestaurantMenu, MdSchedule } from 'react-icons/md'
import { FaStar } from 'react-icons/fa'
import api from '../api'

function RecipeCard({ recipe }) {
  const navigate = useNavigate()
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

  const isFavorited = user?.favorites?.includes(recipe._id)

  const handleFavoriteClick = async (e) => {
    e.preventDefault()
    if (!user) {
      navigate('/login')
      return
    }

    try {
      await api.post(`/recipes/favorite/${recipe._id}`)
      
      const currentFavorites = user.favorites || []
      const updatedFavorites = isFavorited 
        ? currentFavorites.filter(id => id !== recipe._id)
        : [...currentFavorites, recipe._id]
      
      const updatedUser = { ...user, favorites: updatedFavorites }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setUser(updatedUser)
      window.dispatchEvent(new Event('userChanged'))
    } catch (err) {
      console.error('Favori işlemi başarısız:', err)
      alert('İşlem başarısız oldu.')
    }
  }

  const averageRating = recipe.ratings && recipe.ratings.length > 0
    ? (recipe.ratings.reduce((sum, r) => sum + r.score, 0) / recipe.ratings.length).toFixed(1)
    : null

  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0)

  return (
    <Link to={`/recipe/${recipe._id}`} className="block h-full">
      <article className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(52,46,41,0.05)] hover:shadow-[0_8px_24px_rgba(52,46,41,0.1)] transition-all group flex flex-col h-full">
        <div className="relative h-64 overflow-hidden bg-surface-container">
          <div className="w-full h-full flex items-center justify-center bg-surface-container-high">
            <MdRestaurantMenu className="text-[64px] text-outline-variant" />
          </div>

          <button
            className="absolute top-4 right-4 bg-surface/80 backdrop-blur-md p-2 rounded-full text-on-surface hover:text-primary transition-colors shadow-sm z-10"
            onClick={handleFavoriteClick}
            title={isFavorited ? "Favorilerden Çıkar" : "Favorilere Ekle"}
          >
            {isFavorited ? <MdFavorite className="text-xl text-primary" /> : <MdFavoriteBorder className="text-xl" />}
          </button>
        </div>

        <div className="p-6 flex flex-col flex-grow">
          <div className="flex gap-2 mb-3">
            {recipe.category && (
              <span className="bg-surface-container-high text-on-surface-variant px-2 py-1 rounded-md text-xs font-medium">
                {recipe.category.name || 'Kategori'}
              </span>
            )}
            {averageRating && (
              <span className="bg-primary-fixed text-on-primary-fixed px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                <FaStar className="text-[12px]" />
                {averageRating}
              </span>
            )}
          </div>

          <h3 className="font-display text-xl text-on-surface mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {recipe.title}
          </h3>

          <p className="text-base text-on-surface-variant mb-4 line-clamp-2">
            {recipe.description}
          </p>

          <div className="mt-auto flex items-center justify-between border-t border-outline-variant/30 pt-4">
            <div className="flex items-center gap-1 text-on-surface-variant text-xs font-medium">
              <MdPerson className="text-base" />
              {recipe.author?.username || 'Anonim'}
            </div>
            
            <div className="flex items-center gap-3">
              {totalTime > 0 && (
                <div className="flex items-center gap-1 text-on-surface-variant text-xs font-medium">
                  <MdSchedule className="text-base" />
                  {totalTime} dk
                </div>
              )}
              <div className="flex items-center gap-1 text-on-surface-variant text-xs font-medium">
                <MdChecklist className="text-base" />
                {recipe.ingredients?.length || 0} mlz
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}

export default RecipeCard
