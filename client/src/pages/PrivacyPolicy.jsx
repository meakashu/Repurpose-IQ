import { FaShieldAlt, FaLock, FaCookie, FaEnvelope } from 'react-icons/fa';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-yellow-400">
            {/* Hero */}
            <section className="border-b-2 border-black bg-white">
                <div className="max-w-4xl mx-auto px-6 lg:px-12 py-16 lg:py-20">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center">
                            <FaShieldAlt className="text-yellow-400 text-2xl" />
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold text-black font-space-grotesk">Privacy Policy</h1>
                    </div>
                    <p className="text-lg text-black font-inter opacity-70">
                        Effective Date: January 1, 2025
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="bg-white border-b-2 border-black">
                <div className="max-w-4xl mx-auto px-6 lg:px-12 py-16">
                    <div className="space-y-12">
                        {/* Introduction */}
                        <div>
                            <p className="text-lg text-black font-inter leading-relaxed">
                                RepurposeIQ ("we," "our," or "us") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our pharmaceutical intelligence platform.
                            </p>
                        </div>

                        {/* Information We Collect */}
                        <div>
                            <h2 className="text-2xl font-bold text-black mb-6 font-space-grotesk">Information We Collect</h2>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-bold text-black mb-3 font-space-grotesk">Information You Provide</h3>
                                    <ul className="list-disc list-inside space-y-2 text-black font-inter">
                                        <li>Account information (name, email address, company name)</li>
                                        <li>Profile data and preferences</li>
                                        <li>Query history and search terms</li>
                                        <li>Uploaded documents and files</li>
                                        <li>Communication with our support team</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-black mb-3 font-space-grotesk">Automatically Collected Information</h3>
                                    <ul className="list-disc list-inside space-y-2 text-black font-inter">
                                        <li>Usage data (pages visited, features used, time spent)</li>
                                        <li>Device information (browser type, operating system)</li>
                                        <li>IP addresses and location data</li>
                                        <li>Cookies and similar tracking technologies</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* How We Use Your Information */}
                        <div>
                            <h2 className="text-2xl font-bold text-black mb-4 font-space-grotesk">How We Use Your Information</h2>
                            <div className="medical-card p-6">
                                <ul className="space-y-3 text-black font-inter">
                                    <li className="flex gap-3">
                                        <span className="text-yellow-600">•</span>
                                        <span>Provide and improve our services</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="text-yellow-600">•</span>
                                        <span>Personalize your experience and recommendations</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="text-yellow-600">•</span>
                                        <span>Communicate with you about updates and features</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="text-yellow-600">•</span>
                                        <span>Ensure security and prevent fraud</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="text-yellow-600">•</span>
                                        <span>Comply with legal obligations</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="text-yellow-600">•</span>
                                        <span>Analyze usage patterns and improve our AI models</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Data Sharing */}
                        <div>
                            <h2 className="text-2xl font-bold text-black mb-4 font-space-grotesk">Data Sharing</h2>
                            <p className="text-black font-inter leading-relaxed mb-4">
                                <strong>We do not sell your personal information.</strong> We may share your data with:
                            </p>
                            <div className="space-y-4">
                                <div className="medical-card p-6">
                                    <h4 className="font-bold text-black mb-2 font-space-grotesk">Service Providers</h4>
                                    <p className="text-black font-inter">
                                        Third-party vendors who help us operate our platform (hosting, analytics, customer support)
                                    </p>
                                </div>
                                <div className="medical-card p-6">
                                    <h4 className="font-bold text-black mb-2 font-space-grotesk">Legal Authorities</h4>
                                    <p className="text-black font-inter">
                                        When required by law or to protect our legal rights
                                    </p>
                                </div>
                                <div className="medical-card p-6">
                                    <h4 className="font-bold text-black mb-2 font-space-grotesk">Business Partners</h4>
                                    <p className="text-black font-inter">
                                        Only with your explicit consent
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Data Security */}
                        <div>
                            <div className="flex items-start gap-4 mb-4">
                                <FaLock className="text-black text-2xl flex-shrink-0 mt-1" />
                                <div>
                                    <h2 className="text-2xl font-bold text-black mb-4 font-space-grotesk">Data Security</h2>
                                    <p className="text-black font-inter leading-relaxed">
                                        We implement industry-standard security measures to protect your information, including encryption, secure servers, access controls, and regular security audits. However, no method of transmission over the internet is 100% secure.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Your Rights */}
                        <div>
                            <h2 className="text-2xl font-bold text-black mb-4 font-space-grotesk">Your Rights</h2>
                            <p className="text-black font-inter leading-relaxed mb-4">
                                You have the right to:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="medical-card p-4">
                                    <p className="text-black font-inter font-semibold">✓ Access your data</p>
                                </div>
                                <div className="medical-card p-4">
                                    <p className="text-black font-inter font-semibold">✓ Correct inaccuracies</p>
                                </div>
                                <div className="medical-card p-4">
                                    <p className="text-black font-inter font-semibold">✓ Delete your account</p>
                                </div>
                                <div className="medical-card p-4">
                                    <p className="text-black font-inter font-semibold">✓ Export your data</p>
                                </div>
                                <div className="medical-card p-4">
                                    <p className="text-black font-inter font-semibold">✓ Opt-out of marketing</p>
                                </div>
                                <div className="medical-card p-4">
                                    <p className="text-black font-inter font-semibold">✓ Withdraw consent</p>
                                </div>
                            </div>
                        </div>

                        {/* Cookies */}
                        <div>
                            <div className="flex items-start gap-4 mb-4">
                                <FaCookie className="text-black text-2xl flex-shrink-0 mt-1" />
                                <div>
                                    <h2 className="text-2xl font-bold text-black mb-4 font-space-grotesk">Cookies</h2>
                                    <p className="text-black font-inter leading-relaxed mb-4">
                                        We use cookies and similar technologies to enhance your experience, analyze usage, and personalize content. You can control cookies through your browser settings.
                                    </p>
                                    <p className="text-black font-inter leading-relaxed">
                                        Types of cookies we use: Essential cookies, Analytics cookies, Preference cookies, and Marketing cookies.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Third-Party Services */}
                        <div>
                            <h2 className="text-2xl font-bold text-black mb-4 font-space-grotesk">Third-Party Services</h2>
                            <p className="text-black font-inter leading-relaxed mb-4">
                                Our platform integrates with third-party services:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-black font-inter">
                                <li>Google Analytics (usage analytics)</li>
                                <li>GROQ AI API (AI-powered insights)</li>
                                <li>Payment processors (subscription billing)</li>
                            </ul>
                        </div>

                        {/* International Data Transfers */}
                        <div>
                            <h2 className="text-2xl font-bold text-black mb-4 font-space-grotesk">International Data Transfers</h2>
                            <p className="text-black font-inter leading-relaxed">
                                Your data may be processed in the United States and other countries where our service providers operate. We ensure appropriate safeguards are in place for international transfers.
                            </p>
                        </div>

                        {/* Changes to Privacy Policy */}
                        <div>
                            <h2 className="text-2xl font-bold text-black mb-4 font-space-grotesk">Changes to This Privacy Policy</h2>
                            <p className="text-black font-inter leading-relaxed">
                                We will notify you of material changes to this Privacy Policy via email or prominent notice on our platform.
                            </p>
                        </div>

                        {/* Contact */}
                        <div className="medical-card p-8 bg-yellow-400">
                            <div className="flex items-start gap-4">
                                <FaEnvelope className="text-black text-2xl flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-xl font-bold text-black mb-2 font-space-grotesk">Contact Us</h3>
                                    <p className="text-black font-inter mb-4">
                                        For privacy-related questions or to exercise your rights:
                                    </p>
                                    <a href="mailto:privacy@repurposeiq.com" className="text-black font-bold hover:text-yellow-600 transition-colors block mb-2">
                                        privacy@repurposeiq.com
                                    </a>
                                    <p className="text-black font-inter text-sm">
                                        RepurposeIQ Privacy Team<br />
                                        123 Pharma Boulevard<br />
                                        San Francisco, CA 94102
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
