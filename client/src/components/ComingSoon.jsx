import { Link } from 'react-router-dom';
import { FaConstruction } from 'react-icons/fa';

export default function ComingSoon({ title = "Coming Soon" }) {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-center p-8 max-w-2xl">
                <div className="w-24 h-24 bg-yellow-400 border-2 border-black rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                    <FaConstruction className="text-4xl text-black" />
                </div>
                <h1 className="text-5xl font-bold font-space-grotesk mb-6">{title}</h1>
                <p className="text-xl font-inter text-gray-600 mb-8">
                    We are currently building this page. Check back soon for updates.
                </p>
                <Link to="/" className="btn-medical-primary px-8 py-3 inline-flex">
                    Return Home
                </Link>
            </div>
        </div>
    );
}
