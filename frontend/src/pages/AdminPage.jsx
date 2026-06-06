import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import {
    MdRestaurantMenu,
    MdCategory,
    MdPerson,
    MdReceiptLong,
    MdSearch,
    MdEdit,
    MdDelete,
    MdImage,
    MdError,
    MdClose
} from 'react-icons/md';
import { FaSpinner } from 'react-icons/fa';
import api from '../api';

/* ─── Ortak Düzenleme Modal'ı ─── */
function EditModal({ isOpen, onClose, type, data, categories, onSave }) {
    const [form, setForm] = useState(() => {
        if (type === 'recipe') {
            return {
                title: data?.title || '',
                description: data?.description || '',
                ingredients: data?.ingredients ? data.ingredients.join(', ') : '',
                instructions: data?.instructions || '',
                category: data?.category?._id || data?.category || '',
                prepTime: data?.prepTime || 0,
                cookTime: data?.cookTime || 0,
                servings: data?.servings || 1,
            };
        } else {
            return {
                name: data?.name || '',
                description: data?.description || '',
            };
        }
    });
    const [saving, setSaving] = useState(false);

    if (!isOpen) return null;

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            let payload = { ...form };
            if (type === 'recipe' && typeof payload.ingredients === 'string') {
                payload.ingredients = payload.ingredients.split(',').map(s => s.trim()).filter(Boolean);
            }
            await onSave(data._id, payload);
            onClose();
        } catch (err) {
            alert(err.response?.data?.message || 'Kaydetme sırasında hata oluştu');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Modal */}
            <div
                className="relative bg-surface rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[85vh] flex flex-col border border-outline-variant/30"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/20">
                    <h3 className="font-display text-lg font-bold text-on-surface">
                        {type === 'recipe' 
                            ? (data ? 'Tarif Düzenle' : 'Yeni Tarif Ekle') 
                            : (data ? 'Kategori Düzenle' : 'Yeni Kategori Ekle')}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors"
                    >
                        <MdClose className="text-xl" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
                    {type === 'category' ? (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-on-surface mb-1.5">Kategori Adı</label>
                                <input
                                    type="text"
                                    value={form.name || ''}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    className="w-full bg-surface-container-lowest border border-outline-variant/50 text-on-surface rounded-lg px-3 py-2 focus:outline-none focus:border-primary transition-colors text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-on-surface mb-1.5">Açıklama</label>
                                <textarea
                                    value={form.description || ''}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                    className="w-full bg-surface-container-lowest border border-outline-variant/50 text-on-surface rounded-lg px-3 py-2 focus:outline-none focus:border-primary transition-colors text-sm resize-none"
                                    rows="3"
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-on-surface mb-1.5">Tarif Adı</label>
                                <input
                                    type="text"
                                    value={form.title || ''}
                                    onChange={(e) => handleChange('title', e.target.value)}
                                    className="w-full bg-surface-container-lowest border border-outline-variant/50 text-on-surface rounded-lg px-3 py-2 focus:outline-none focus:border-primary transition-colors text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-on-surface mb-1.5">Açıklama</label>
                                <textarea
                                    value={form.description || ''}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                    className="w-full bg-surface-container-lowest border border-outline-variant/50 text-on-surface rounded-lg px-3 py-2 focus:outline-none focus:border-primary transition-colors text-sm resize-none"
                                    rows="2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-on-surface mb-1.5">Malzemeler (virgülle ayırın)</label>
                                <textarea
                                    value={form.ingredients || ''}
                                    onChange={(e) => handleChange('ingredients', e.target.value)}
                                    className="w-full bg-surface-container-lowest border border-outline-variant/50 text-on-surface rounded-lg px-3 py-2 focus:outline-none focus:border-primary transition-colors text-sm resize-none"
                                    rows="3"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-on-surface mb-1.5">Yapılış</label>
                                <textarea
                                    value={form.instructions || ''}
                                    onChange={(e) => handleChange('instructions', e.target.value)}
                                    className="w-full bg-surface-container-lowest border border-outline-variant/50 text-on-surface rounded-lg px-3 py-2 focus:outline-none focus:border-primary transition-colors text-sm resize-none"
                                    rows="4"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-on-surface mb-1.5">Kategori</label>
                                <select
                                    value={form.category || ''}
                                    onChange={(e) => handleChange('category', e.target.value)}
                                    className="w-full bg-surface-container-lowest border border-outline-variant/50 text-on-surface rounded-lg px-3 py-2 focus:outline-none focus:border-primary transition-colors text-sm"
                                    required
                                >
                                    <option value="">Kategori seçin</option>
                                    {categories.map(cat => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-on-surface mb-1.5">Hazırlık (dk)</label>
                                    <input
                                        type="number" min="0"
                                        value={form.prepTime || 0}
                                        onChange={(e) => handleChange('prepTime', Number(e.target.value))}
                                        className="w-full bg-surface-container-lowest border border-outline-variant/50 text-on-surface rounded-lg px-3 py-2 focus:outline-none focus:border-primary transition-colors text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-on-surface mb-1.5">Pişirme (dk)</label>
                                    <input
                                        type="number" min="0"
                                        value={form.cookTime || 0}
                                        onChange={(e) => handleChange('cookTime', Number(e.target.value))}
                                        className="w-full bg-surface-container-lowest border border-outline-variant/50 text-on-surface rounded-lg px-3 py-2 focus:outline-none focus:border-primary transition-colors text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-on-surface mb-1.5">Porsiyon</label>
                                    <input
                                        type="number" min="1"
                                        value={form.servings || 1}
                                        onChange={(e) => handleChange('servings', Number(e.target.value))}
                                        className="w-full bg-surface-container-lowest border border-outline-variant/50 text-on-surface rounded-lg px-3 py-2 focus:outline-none focus:border-primary transition-colors text-sm"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {/* Footer */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-surface-container border border-outline-variant/30 text-on-surface font-medium py-2 rounded-lg hover:bg-surface-container-high transition-colors text-sm"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 bg-primary text-on-primary font-medium py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
                        >
                            {saving ? 'Kaydediliyor...' : 'Kaydet'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ─── Admin Page ─── */
function AdminPage() {
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('dashboard');
    const [currentAdmin] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('user') || '{}');
        } catch {
            return {};
        }
    });
    const [adminUsername] = useState(() => {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            return user.username || 'Admin';
        } catch {
            return 'Admin';
        }
    });

    // Modal state
    const [editModal, setEditModal] = useState({ open: false, type: null, data: null });

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (!savedUser) {
            navigate('/login');
            return;
        }
        const user = JSON.parse(savedUser);
        if (user.role !== 'admin') {
            navigate('/');
            return;
        }

        const fetchData = async () => {
            try {
                const [recipesRes, categoriesRes, usersRes] = await Promise.all([
                    api.get('/recipes'),
                    api.get('/categories'),
                    api.get('/auth/users')
                ]);
                setRecipes(recipesRes.data.data || []);
                setCategories(categoriesRes.data.data || []);
                setUsers(usersRes.data.data || []);
            } catch (err) {
                console.error('Veri çekilirken hata:', err);
                setError('Veriler yüklenirken bir sorun oluştu.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('userChanged'));
        navigate('/');
    };

    /* ── Kategori İşlemleri ── */
    const handleCreateCategory = async (payload) => {
        try {
            await api.post('/categories/create-category', payload);
            const res = await api.get('/categories');
            setCategories(res.data.data || []);
        } catch (err) {
            alert(err.response?.data?.message || 'Kategori kaydedilirken hata oluştu');
        }
    };

    const handleUpdateCategory = async (id, payload) => {
        await api.put(`/categories/${id}`, payload);
        const res = await api.get('/categories');
        setCategories(res.data.data || []);
    };

    const handleDeleteCategory = async (id) => {
        if (!window.confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) return;
        try {
            await api.delete(`/categories/${id}`);
            const res = await api.get('/categories');
            setCategories(res.data.data || []);
        } catch (err) {
            alert(err.response?.data?.message || 'Kategori silinirken hata oluştu');
        }
    };

    /* ── Tarif İşlemleri ── */
    const handleCreateRecipe = async (payload) => {
        try {
            await api.post('/recipes/create-recipe', payload);
            const res = await api.get('/recipes');
            setRecipes(res.data.data || []);
        } catch (err) {
            alert(err.response?.data?.message || 'Tarif eklenirken hata oluştu');
        }
    };

    const handleUpdateRecipe = async (id, payload) => {
        await api.put(`/recipes/${id}`, payload);
        const res = await api.get('/recipes');
        setRecipes(res.data.data || []);
    };

    const handleDeleteRecipe = async (id) => {
        if (!window.confirm('Bu tarifi silmek istediğinize emin misiniz?')) return;
        try {
            await api.delete(`/recipes/${id}`);
            const res = await api.get('/recipes');
            setRecipes(res.data.data || []);
        } catch (err) {
            alert(err.response?.data?.message || 'Tarif silinirken hata oluştu');
        }
    };

    /* ── Kullanıcı İşlemleri ── */
    const handleDeleteUser = async (id) => {
        if (!window.confirm('Bu kullanıcıyı silmek istediğinize emin misiniz? Bu işlem geri alınamaz!')) return;
        try {
            await api.delete(`/auth/users/${id}`);
            const res = await api.get('/auth/users');
            setUsers(res.data.data || []);
        } catch (err) {
            alert(err.response?.data?.message || 'Kullanıcı silinirken hata oluştu');
        }
    };

    /* ── Modal Aç/Kapa ── */
    const openEditModal = (type, data) => {
        setEditModal({ open: true, type, data });
    };

    const closeEditModal = () => {
        setEditModal({ open: false, type: null, data: null });
    };

    const handleModalSave = async (id, payload) => {
        if (editModal.type === 'recipe') {
            if (id) {
                await handleUpdateRecipe(id, payload);
            } else {
                await handleCreateRecipe(payload);
            }
        } else {
            if (id) {
                await handleUpdateCategory(id, payload);
            } else {
                await handleCreateCategory(payload);
            }
        }
    };

    const filteredRecipes = recipes.filter(r =>
        r.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.author?.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredCategories = categories.filter(c =>
        c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const tabTitle = activeTab === 'dashboard' ? 'Genel Bakış' : activeTab === 'tarifler' ? 'Tarifler' : 'Kategoriler';

    return (
        <>
            {/* Edit Modal */}
            <EditModal
                key={editModal.open ? `${editModal.type}-${editModal.data?._id || 'new'}` : 'closed'}
                isOpen={editModal.open}
                onClose={closeEditModal}
                type={editModal.type}
                data={editModal.data}
                categories={categories}
                onSave={handleModalSave}
            />

            <AdminLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                adminUsername={adminUsername}
                handleLogout={handleLogout}
                tabTitle={tabTitle}
            >


                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-64 text-on-surface-variant">
                            <FaSpinner className="animate-spin text-4xl text-primary mb-4" />
                            <p>Veriler yükleniyor...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-error-container text-on-error-container p-4 rounded-xl flex items-center gap-3">
                            <MdError className="text-2xl" />
                            <p>{error}</p>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'dashboard' && (
                                <>
                                    {/* Dashboard Stat Cards */}
                                    <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                        <div className="bg-surface rounded-xl p-5 border border-outline-variant/20">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm text-on-surface-variant mb-1">Toplam Tarif</p>
                                                    <h3 className="font-display text-3xl font-bold text-on-surface">{recipes.length}</h3>
                                                </div>
                                                <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                                                    <MdReceiptLong className="text-xl" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-surface rounded-xl p-5 border border-outline-variant/20">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm text-on-surface-variant mb-1">Toplam Kategori</p>
                                                    <h3 className="font-display text-3xl font-bold text-on-surface">{categories.length}</h3>
                                                </div>
                                                <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-tertiary">
                                                    <MdCategory className="text-xl" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-surface rounded-xl p-5 border border-outline-variant/20">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm text-on-surface-variant mb-1">Toplam Kullanıcı</p>
                                                    <h3 className="font-display text-3xl font-bold text-on-surface">{users.length}</h3>
                                                </div>
                                                <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-secondary">
                                                    <MdPerson className="text-xl" />
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Users List */}
                                    <section className="bg-surface rounded-xl border border-outline-variant/20 overflow-hidden">
                                        <div className="p-5 border-b border-outline-variant/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                            <h3 className="font-display text-xl font-bold text-on-surface">
                                                Kayıtlı Kullanıcılar
                                            </h3>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse min-w-[800px]">
                                                <thead>
                                                    <tr className="bg-surface-container-low border-b border-outline-variant/20">
                                                        <th className="py-3 px-5 font-medium text-xs text-on-surface-variant uppercase tracking-wider">Kullanıcı Adı</th>
                                                        <th className="py-3 px-5 font-medium text-xs text-on-surface-variant uppercase tracking-wider">E-posta</th>
                                                        <th className="py-3 px-5 font-medium text-xs text-on-surface-variant uppercase tracking-wider">Rol</th>
                                                        <th className="py-3 px-5 font-medium text-xs text-on-surface-variant uppercase tracking-wider">Kayıt Tarihi</th>
                                                        <th className="py-3 px-5 font-medium text-xs text-on-surface-variant uppercase tracking-wider text-right">İşlemler</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-outline-variant/10">
                                                    {users.length > 0 ? (
                                                        users.map((u) => (
                                                            <tr key={u._id} className="hover:bg-surface-container-lowest transition-colors group">
                                                                <td className="py-3 px-5">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                                            {u.username?.charAt(0).toUpperCase()}
                                                                        </div>
                                                                        <p className="font-medium text-sm text-on-surface">{u.username}</p>
                                                                    </div>
                                                                </td>
                                                                <td className="py-3 px-5 text-sm text-on-surface-variant">{u.email}</td>
                                                                <td className="py-3 px-5">
                                                                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                                                                        u.role === 'admin' 
                                                                            ? 'bg-primary/10 text-primary' 
                                                                            : 'bg-surface-container-high text-on-surface-variant'
                                                                    }`}>
                                                                        {u.role === 'admin' ? 'Admin' : 'Üye'}
                                                                    </span>
                                                                </td>
                                                                <td className="py-3 px-5 text-sm text-on-surface-variant">
                                                                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                                                                </td>
                                                                <td className="py-3 px-5 text-right">
                                                                    {u._id !== currentAdmin.id && u._id !== currentAdmin._id ? (
                                                                        <button
                                                                            onClick={() => handleDeleteUser(u._id)}
                                                                            className="p-2 text-on-surface-variant hover:text-error hover:bg-surface-container rounded-lg transition-colors"
                                                                            title="Kullanıcıyı Sil"
                                                                        >
                                                                            <MdDelete className="text-lg" />
                                                                        </button>
                                                                    ) : (
                                                                        <span className="text-xs text-on-surface-variant/50 italic mr-2">Aktif Admin</span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="5" className="py-8 text-center text-on-surface-variant text-sm">
                                                                Kullanıcı bulunamadı.
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="p-4 border-t border-outline-variant/20 flex items-center justify-between bg-surface-container-low">
                                            <p className="text-xs text-on-surface-variant">
                                                Toplam {users.length} kullanıcı
                                            </p>
                                        </div>
                                    </section>
                                </>
                            )}

                            {activeTab === 'tarifler' && (
                                <section className="bg-surface rounded-xl border border-outline-variant/20 overflow-hidden">
                                    <div className="p-5 border-b border-outline-variant/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <h3 className="font-display text-xl font-bold text-on-surface">
                                            Tüm Tarifler
                                        </h3>
                                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                                            <button
                                                onClick={() => openEditModal('recipe', null)}
                                                className="bg-primary text-on-primary text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity shadow-sm flex items-center gap-1.5 w-full sm:w-auto justify-center"
                                            >
                                                <MdRestaurantMenu className="text-lg" />
                                                Yeni Tarif Ekle
                                            </button>
                                            <div className="relative w-full md:w-64">
                                                <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl" />
                                                <input
                                                    className="w-full bg-surface-container-lowest border border-outline-variant/50 text-on-surface rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-primary transition-colors text-sm placeholder-on-surface-variant/50"
                                                    placeholder="Tarif ara..."
                                                    type="text"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse min-w-[800px]">
                                            <thead>
                                                <tr className="bg-surface-container-low border-b border-outline-variant/20">
                                                    <th className="py-3 px-5 font-medium text-xs text-on-surface-variant uppercase tracking-wider">Tarif Adı</th>
                                                    <th className="py-3 px-5 font-medium text-xs text-on-surface-variant uppercase tracking-wider">Ekleyen</th>
                                                    <th className="py-3 px-5 font-medium text-xs text-on-surface-variant uppercase tracking-wider">Kategori</th>
                                                    <th className="py-3 px-5 font-medium text-xs text-on-surface-variant uppercase tracking-wider">Durum</th>
                                                    <th className="py-3 px-5 font-medium text-xs text-on-surface-variant uppercase tracking-wider text-right">İşlemler</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-outline-variant/10">
                                                {filteredRecipes.length > 0 ? (
                                                    filteredRecipes.map((recipe) => (
                                                        <tr key={recipe._id} className="hover:bg-surface-container-lowest transition-colors group">
                                                            <td className="py-3 px-5">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-10 h-10 rounded-lg bg-surface-container overflow-hidden shrink-0 flex items-center justify-center text-outline-variant">
                                                                        <MdImage className="text-xl" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-medium text-sm text-on-surface">{recipe.title}</p>
                                                                        <p className="text-xs text-on-surface-variant">
                                                                            {new Date(recipe.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="py-3 px-5 text-sm text-on-surface-variant">{recipe.author?.username || 'Bilinmiyor'}</td>
                                                            <td className="py-3 px-5 text-sm text-on-surface-variant">{recipe.category?.name || 'Kategorisiz'}</td>
                                                            <td className="py-3 px-5">
                                                                <span className="text-xs text-tertiary font-medium">Aktif</span>
                                                            </td>
                                                            <td className="py-3 px-5 text-right">
                                                                <div className="flex items-center justify-end gap-1">
                                                                    <button
                                                                        onClick={() => openEditModal('recipe', recipe)}
                                                                        className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-colors"
                                                                        title="Düzenle"
                                                                    >
                                                                        <MdEdit className="text-lg" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDeleteRecipe(recipe._id)}
                                                                        className="p-2 text-on-surface-variant hover:text-error hover:bg-surface-container rounded-lg transition-colors"
                                                                        title="Sil"
                                                                    >
                                                                        <MdDelete className="text-lg" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="5" className="py-8 text-center text-on-surface-variant text-sm">
                                                            Tarif bulunamadı.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    <div className="p-4 border-t border-outline-variant/20 flex items-center justify-between bg-surface-container-low">
                                        <p className="text-xs text-on-surface-variant hidden md:block">
                                            Toplam {filteredRecipes.length} tarif
                                        </p>
                                        <div className="flex items-center gap-1 w-full justify-center md:justify-end md:w-auto">
                                            <button className="w-8 h-8 rounded bg-primary text-on-primary font-semibold text-sm flex items-center justify-center">1</button>
                                        </div>
                                    </div>
                                </section>
                            )}

                            {activeTab === 'kategoriler' && (
                                <section className="bg-surface rounded-xl border border-outline-variant/20 overflow-hidden">
                                    <div className="p-5 border-b border-outline-variant/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <h3 className="font-display text-xl font-bold text-on-surface">
                                            Mevcut Kategoriler
                                        </h3>
                                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                                            <button
                                                onClick={() => openEditModal('category', null)}
                                                className="bg-primary text-on-primary text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity shadow-sm flex items-center gap-1.5 w-full sm:w-auto justify-center"
                                            >
                                                <MdCategory className="text-lg" />
                                                Yeni Kategori Ekle
                                            </button>
                                            <div className="relative w-full md:w-64">
                                                <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl" />
                                                <input
                                                    className="w-full bg-surface-container-lowest border border-outline-variant/50 text-on-surface rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-primary transition-colors text-sm placeholder-on-surface-variant/50"
                                                    placeholder="Kategori ara..."
                                                    type="text"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse min-w-[600px]">
                                            <thead>
                                                <tr className="bg-surface-container-low border-b border-outline-variant/20">
                                                    <th className="py-3 px-5 font-medium text-xs text-on-surface-variant uppercase tracking-wider">Kategori Adı</th>
                                                    <th className="py-3 px-5 font-medium text-xs text-on-surface-variant uppercase tracking-wider">Açıklama</th>
                                                    <th className="py-3 px-5 font-medium text-xs text-on-surface-variant uppercase tracking-wider text-right">İşlemler</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-outline-variant/10">
                                                {filteredCategories.length > 0 ? (
                                                    filteredCategories.map((cat) => (
                                                        <tr key={cat._id} className="hover:bg-surface-container-lowest transition-colors group">
                                                            <td className="py-3 px-5 font-medium text-sm text-on-surface">{cat.name}</td>
                                                            <td className="py-3 px-5 text-sm text-on-surface-variant">{cat.description || '-'}</td>
                                                            <td className="py-3 px-5 text-right">
                                                                <div className="flex items-center justify-end gap-1">
                                                                    <button
                                                                        onClick={() => openEditModal('category', cat)}
                                                                        className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-colors"
                                                                        title="Düzenle"
                                                                    >
                                                                        <MdEdit className="text-lg" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDeleteCategory(cat._id)}
                                                                        className="p-2 text-on-surface-variant hover:text-error hover:bg-surface-container rounded-lg transition-colors"
                                                                        title="Sil"
                                                                    >
                                                                        <MdDelete className="text-lg" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="3" className="py-8 text-center text-on-surface-variant text-sm">
                                                            Kategori bulunamadı.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="p-4 border-t border-outline-variant/20 flex items-center justify-between bg-surface-container-low">
                                        <p className="text-xs text-on-surface-variant">
                                            Toplam {filteredCategories.length} kategori
                                        </p>
                                    </div>
                                </section>
                            )}
                        </>
                    )}
            </AdminLayout>
        </>
    );
}

export default AdminPage;
