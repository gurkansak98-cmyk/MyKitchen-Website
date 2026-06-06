import { Link } from 'react-router-dom'

function Footer() {
    return (
        <footer className="w-full mb-[80px] md:mb-0 px-4 md:px-10">
            <div className="max-w-[1280px] mx-auto bg-surface-container border-t border-outline-variant/20 py-10 px-6 md:px-10 flex flex-col md:flex-row justify-between items-start gap-6 rounded-t-2xl">
                <div className="flex flex-col gap-3">
                    <Link to="/" className="font-display text-2xl text-primary font-bold">
                        MyKitchen
                    </Link>
                    <p className="text-sm text-on-surface-variant">
                        © {new Date().getFullYear()} MyKitchen. Yemekle bağları besliyoruz.
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
