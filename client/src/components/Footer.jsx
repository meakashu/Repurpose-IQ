import { Link } from 'react-router-dom';
import { FaLinkedin, FaTwitter, FaGithub, FaYoutube, FaMedium } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="border-t-2 border-black bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div>
                        <div className="mb-6">
                            <img src="/images/footer-logo.png" alt="RepurposeIQ" className="h-12 w-auto" />
                        </div>
                        <p className="text-black font-inter text-sm mb-4">
                            AI-powered pharmaceutical intelligence for drug repurposing research.
                        </p>
                        <div className="text-black text-sm font-inter">
                            <p className="font-semibold">Contact:</p>
                            <p>Akash Kumar Singh</p>
                            <p>+91 7255003131</p>
                            <a href="mailto:meakashu22dotin@gmail.com" className="hover:text-yellow-600 transition-colors">
                                meakashu22dotin@gmail.com
                            </a>
                        </div>
                    </div>

                    {/* Product */}
                    <div>
                        <h3 className="font-bold text-black mb-4 font-space-grotesk">Product</h3>
                        <ul className="space-y-2 text-black text-sm font-inter">
                            <li><Link to="/features" className="hover:text-yellow-600 transition-colors">Features</Link></li>
                            <li><Link to="/pricing" className="hover:text-yellow-600 transition-colors">Pricing</Link></li>
                            <li><Link to="/case-studies" className="hover:text-yellow-600 transition-colors">Case Studies</Link></li>
                            <li><Link to="/api-docs" className="hover:text-yellow-600 transition-colors">API Documentation</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="font-bold text-black mb-4 font-space-grotesk">Company</h3>
                        <ul className="space-y-2 text-black text-sm font-inter">
                            <li><Link to="/about" className="hover:text-yellow-600 transition-colors">About Us</Link></li>
                            <li><Link to="/team" className="hover:text-yellow-600 transition-colors">Our Team</Link></li>
                            <li><Link to="/careers" className="hover:text-yellow-600 transition-colors">Careers</Link></li>
                            <li><Link to="/blog" className="hover:text-yellow-600 transition-colors">Blog</Link></li>
                            <li><Link to="/contact" className="hover:text-yellow-600 transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="font-bold text-black mb-4 font-space-grotesk">Legal</h3>
                        <ul className="space-y-2 text-black text-sm font-inter">
                            <li><Link to="/privacy" className="hover:text-yellow-600 transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="hover:text-yellow-600 transition-colors">Terms of Service</Link></li>
                            <li><Link to="/disclaimer" className="hover:text-yellow-600 transition-colors">Disclaimer</Link></li>
                            <li><Link to="/cookies" className="hover:text-yellow-600 transition-colors">Cookie Policy</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Social Links */}
                <div className="mt-12 pt-8 border-t-2 border-black">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <p className="text-black text-sm font-inter">
                            © 2025 RepurposeIQ. All rights reserved.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center text-black hover:bg-black hover:text-yellow-400 transition-all">
                                <FaLinkedin className="text-lg" />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center text-black hover:bg-black hover:text-yellow-400 transition-all">
                                <FaTwitter className="text-lg" />
                            </a>
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center text-black hover:bg-black hover:text-yellow-400 transition-all">
                                <FaGithub className="text-lg" />
                            </a>
                            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center text-black hover:bg-black hover:text-yellow-400 transition-all">
                                <FaYoutube className="text-lg" />
                            </a>
                            <a href="https://medium.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center text-black hover:bg-black hover:text-yellow-400 transition-all">
                                <FaMedium className="text-lg" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
