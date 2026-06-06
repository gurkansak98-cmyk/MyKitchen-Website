import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
    MdExplore,
    MdAdd,
    MdFreeBreakfast,
    MdCake,
    MdRestaurant,
    MdDinnerDining,
    MdSetMeal,
    MdEco,
    MdLocalPizza
} from 'react-icons/md'
import { FaSpinner } from 'react-icons/fa'
import api from '../api'

const ctaImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDddmf9bMtwcBGPqwN4hajRN9BNAQs_2sUA8FrXFDBa8XKDG3Y-19WG7-wyRnP53ceYRsH259RSPJlojsSMiF4X9iF1-RIpsMi-fnmwST-4sQD6PsE4z56Vpvx_iTNZfA1l_CbYJ6ppRfzhKhwsELg44SJcVfxfwFMOVyMTQ-hUSinwfxF7vlyUalYCIHfOmuy5W2BaqM5KTImaAolXe6zm6NtP_FA1oHQ47j6L8c3PJoo27v2HGzaizR--v3BMUfgixy1img7pA64'

// Kategori ismine göre dinamik ikon döndüren yardımcı fonksiyon
const getCategoryIcon = (name) => {
    if (!name) return <MdRestaurant className="text-primary text-[48px] mb-3" />

    const lowerName = name.toLowerCase()
    if (lowerName.includes('kahvaltı'))
        return <MdFreeBreakfast className="text-primary text-[48px] mb-3 group-hover:scale-110 transition-transform duration-300" />
    if (lowerName.includes('tatlı') || lowerName.includes('kek') || lowerName.includes('pastane'))
        return <MdCake className="text-primary text-[48px] mb-3 group-hover:scale-110 transition-transform duration-300" />
    if (lowerName.includes('deniz') || lowerName.includes('balık'))
        return <MdSetMeal className="text-primary text-[48px] mb-3 group-hover:scale-110 transition-transform duration-300" />
    if (lowerName.includes('vegan') || lowerName.includes('salata') || lowerName.includes('sağlık'))
        return <MdEco className="text-primary text-[48px] mb-3 group-hover:scale-110 transition-transform duration-300" />
    if (lowerName.includes('hamur') || lowerName.includes('pizza'))
        return <MdLocalPizza className="text-primary text-[48px] mb-3 group-hover:scale-110 transition-transform duration-300" />

    // Varsayılan İkon (Ana yemek vs. için)
    return <MdDinnerDining className="text-primary text-[48px] mb-3 group-hover:scale-110 transition-transform duration-300" />
}

function HomePage() {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const location = useLocation()
    const isLoggedIn = !!localStorage.getItem('token')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoriesRes = await api.get('/categories')
                setCategories(categoriesRes.data.data)
            } catch (err) {
                console.error('Veri çekilirken hata:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        if (!loading && location.hash) {
            const id = location.hash.substring(1)
            const element = document.getElementById(id)
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' })
                }, 100)
            }
        }
    }, [location, loading])

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
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 pt-20 md:pt-24 pb-24 md:pb-0">

            <section id="kategoriler" className="mb-12 scroll-mt-24">
                <div className="flex justify-between items-end mb-6">
                    <h2 className="font-display text-[32px] font-bold text-on-surface">
                        Kategoriler
                    </h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {categories.map((category) => (
                        <Link
                            to={`/recipes?category=${category._id}`}
                            key={category._id}
                            className="group rounded-xl aspect-square shadow-[0_4px_12px_rgba(52,46,41,0.05)] hover:shadow-[0_8px_24px_rgba(52,46,41,0.1)] transition-all bg-surface-container-lowest flex flex-col items-center justify-center p-6 text-center cursor-pointer border border-outline-variant/20 hover:border-primary/30"
                        >
                            {getCategoryIcon(category.name)}
                            <h3 className="font-display text-xl text-on-surface">
                                {category.name}
                            </h3>
                        </Link>
                    ))}

                    <Link to="/recipes" className="group relative rounded-xl overflow-hidden aspect-square shadow-[0_4px_12px_rgba(52,46,41,0.05)] hover:shadow-[0_8px_24px_rgba(52,46,41,0.1)] transition-all bg-surface-container-high flex flex-col items-center justify-center p-6 text-center cursor-pointer">
                        <MdExplore className="text-primary text-[48px] mb-3 group-hover:scale-110 transition-transform duration-300" />
                        <h3 className="font-display text-xl text-on-surface mb-2">
                            Keşfet
                        </h3>
                        <p className="text-sm text-on-surface-variant">
                            Tüm lezzetler
                        </p>
                    </Link>
                </div>
            </section>

            <section className="bg-surface-container-high rounded-3xl p-8 md:p-16 mb-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>

                <div className="max-w-xl relative z-10">
                    <h2 className="font-display text-[48px] leading-[1.2] tracking-tight font-bold text-on-surface mb-4">
                        Kendi Tarifini Paylaş
                    </h2>
                    <p className="text-lg text-on-surface-variant mb-8">
                        Aile yadigarı o özel tarifi veya mutfaktaki yeni keşfinizi
                        topluluğumuzla paylaşın. Yemek pişirmenin birleştirici gücüne inanan
                        binlerce kişiye ilham olun.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link
                            to="/profile"
                            className="bg-primary text-on-primary text-sm font-semibold px-8 py-4 rounded-xl hover:bg-primary-container transition-colors shadow-lg flex items-center gap-2"
                        >
                            <MdAdd className="text-xl" />
                            Tarif Ekle
                        </Link>
                        <Link
                            to={isLoggedIn ? "/recipes" : "/register"}
                            className="border-2 border-primary text-primary text-sm font-semibold px-8 py-4 rounded-xl hover:bg-primary/5 transition-colors flex items-center gap-2"
                        >
                            Topluluğu Keşfet
                        </Link>
                    </div>
                </div>

                <div className="w-full md:w-1/3 aspect-square relative z-10 hidden md:block">
                    <img
                        alt="Birlikte yemek pişirme"
                        className="w-full h-full object-cover rounded-full shadow-[0_8px_24px_rgba(52,46,41,0.1)] border-8 border-surface-container-lowest"
                        src={ctaImage}
                    />
                </div>
            </section>
        </div>
    )
}

export default HomePage
