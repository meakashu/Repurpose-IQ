import { Link, useLocation } from 'react-router-dom';
import { FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';

export default function PublicHeader() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const { isAuthenticated } = useAuthStore();

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/about', label: 'About' },
        { path: '/blog', label: 'Blog' },
        { path: '/contact', label: 'Contact' },
    ];

    return (
        <header className="border-b-2 border-black bg-white sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                            <span className="text-yellow-400 text-xl font-bold">R</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-black font-space-grotesk">RepurposeIQ</h1>
                            <p className="text-xs text-black opacity-70 font-dm-sans hidden sm:block">AI Platform</p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`font-inter font-semibold transition-colors ${location.pathname === link.path
                                        ? 'text-black underline decoration-2 underline-offset-4'
                                        : 'text-black hover:text-yellow-600'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        {isAuthenticated ? (
                            <Link
                                to="/chat"
                                className="btn-medical-primary px-6 py-2"
                            >
                                Go to Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-black font-semibold hover:text-yellow-600 transition-colors font-inter"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/login"
                                    className="btn-medical-primary px-6 py-2 flex items-center gap-2"
                                >
                                    <FaUserCircle />
                                    Sign In
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 text-black hover:bg-yellow-400 rounded-lg transition-colors"
                    >
                        {mobileMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden mt-4 pt-4 border-t-2 border-black">
                        <nav className="flex flex-col gap-4 mb-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`font-inter font-semibold transition-colors ${location.pathname === link.path
                                            ? 'text-black underline'
                                            : 'text-black hover:text-yellow-600'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                        <div className="flex flex-col gap-3 pt-4 border-t-2 border-black">
                            {isAuthenticated ? (
                                <Link
                                    to="/chat"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="btn-medical-primary px-6 py-3 text-center"
                                >
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="text-center text-black font-semibold hover:text-yellow-600 transition-colors py-2"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/login"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="btn-medical-primary px-6 py-3 text-center"
                                    >
                                        Sign In
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
