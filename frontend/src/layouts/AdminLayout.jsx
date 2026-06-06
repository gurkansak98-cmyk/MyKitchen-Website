
import { Link } from 'react-router-dom';
import {
    MdDashboard,
    MdRestaurantMenu,
    MdCategory,
    MdLogout,
    MdMenu,
    MdPerson
} from 'react-icons/md';

const AdminLayout = ({ children, activeTab, setActiveTab, adminUsername, handleLogout, tabTitle }) => {
    return (
        <div className="flex h-screen overflow-hidden antialiased font-body-md text-body-md bg-background text-on-background w-full">
            {/* Sidebar Navigation */}
            <aside className="w-64 bg-surface-container flex-col h-full border-r border-outline-variant/20 shadow-[4px_0_24px_rgba(52,46,41,0.02)] hidden md:flex z-10 shrink-0">
                <div className="p-6 flex items-center justify-center border-b border-outline-variant/20 h-20 shrink-0">
                    <h1 className="font-display text-2xl font-bold text-primary">Admin Paneli</h1>
                </div>
                <div className="flex-1 overflow-y-auto py-6 px-4">
                    <nav className="space-y-2">
                        <a
                            onClick={(e) => { e.preventDefault(); setActiveTab('dashboard'); }}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group relative cursor-pointer ${activeTab === 'dashboard' ? 'bg-primary-container/10 text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-primary'}`}
                        >
                            {activeTab === 'dashboard' && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full"></span>}
                            <MdDashboard className="text-xl" />
                            <span className="font-semibold text-sm">Genel Bakış</span>
                        </a>
                        <a
                            onClick={(e) => { e.preventDefault(); setActiveTab('tarifler'); }}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group relative cursor-pointer ${activeTab === 'tarifler' ? 'bg-primary-container/10 text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-primary'}`}
                        >
                            {activeTab === 'tarifler' && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full"></span>}
                            <MdRestaurantMenu className="text-xl" />
                            <span className="font-semibold text-sm">Tarifler</span>
                        </a>
                        <a
                            onClick={(e) => { e.preventDefault(); setActiveTab('kategoriler'); }}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group relative cursor-pointer ${activeTab === 'kategoriler' ? 'bg-primary-container/10 text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-primary'}`}
                        >
                            {activeTab === 'kategoriler' && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full"></span>}
                            <MdCategory className="text-xl" />
                            <span className="font-semibold text-sm">Kategoriler</span>
                        </a>
                    </nav>
                </div>
                <div className="p-4 border-t border-outline-variant/20 shrink-0">
                    <a
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-error transition-colors rounded-lg cursor-pointer"
                    >
                        <MdLogout className="text-xl" />
                        <span className="font-semibold text-sm">Çıkış Yap</span>
                    </a>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Top App Bar */}
                <header className="bg-surface/80 backdrop-blur-md border-b border-outline-variant/20 z-20 flex-shrink-0 px-4 md:px-10 py-4 flex justify-between items-center h-20">
                    <div className="flex items-center gap-4">
                        <button className="md:hidden text-on-surface p-2 rounded-full hover:bg-surface-container-high transition-colors">
                            <MdMenu className="text-2xl" />
                        </button>
                        <h2 className="font-display text-2xl font-bold text-on-surface">{tabTitle}</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            to="/profile"
                            className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-1 text-primary hover:bg-primary/5"
                        >
                            <MdPerson className="text-xl" />
                            {adminUsername}
                        </Link>
                    </div>
                </header>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-10 bg-surface-container-lowest">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
