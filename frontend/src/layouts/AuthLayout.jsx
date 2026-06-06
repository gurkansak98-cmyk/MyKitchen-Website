
import { Outlet, Link } from 'react-router-dom';

const AuthLayout = () => {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 pt-20 md:pt-0 bg-background relative">
            {/* Sol üstte ana sayfaya dönme linki */}
            <div className="absolute top-6 left-6 md:top-8 md:left-8">
                <Link to="/" className="font-display text-3xl font-bold text-primary hover:text-primary-container transition-colors">
                    MyKitchen
                </Link>
            </div>
            
            <div className="w-full max-w-md">
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;
