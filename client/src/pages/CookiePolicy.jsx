import { FaCookie, FaCheckCircle, FaCog } from 'react-icons/fa';

export default function CookiePolicy() {
    return (
        <div className="min-h-screen bg-yellow-400">
            {/* Hero */}
            <section className="border-b-2 border-black bg-white">
                <div className="max-w-4xl mx-auto px-6 lg:px-12 py-16 lg:py-20">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center">
                            <FaCookie className="text-yellow-400 text-2xl" />
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold text-black font-space-grotesk">Cookie Policy</h1>
                    </div>
                    <p className="text-lg text-black font-inter opacity-70">
                        Last Updated: January 1, 2025
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="bg-white border-b-2 border-black">
                <div className="max-w-4xl mx-auto px-6 lg:px-12 py-16">
                    <div className="space-y-12">
                        {/* What Are Cookies */}
                        <div>
                            <h2 className="text-2xl font-bold text-black mb-4 font-space-grotesk">What Are Cookies?</h2>
                            <p className="text-black font-inter leading-relaxed">
                                Cookies are small text files that are placed on your computer or mobile device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our service.
                            </p>
                        </div>

                        {/* Types of Cookies */}
                        <div>
                            <h2 className="text-2xl font-bold text-black mb-4 font-space-grotesk">Types of Cookies We Use</h2>

                            <div className="space-y-6">
                                <div className="medical-card p-6">
                                    <div className="flex items-start gap-3 mb-2">
                                        <FaCheckCircle className="text-black mt-1" />
                                        <h3 className="font-bold text-black font-space-grotesk">Essential Cookies</h3>
                                    </div>
                                    <p className="text-black font-inter mb-2">
                                        Required for the website to function properly. These cookies enable core functionality such as security, network management, and accessibility.
                                    </p>
                                    <p className="text-black font-inter text-sm opacity-70">
                                        <strong>Examples:</strong> Authentication tokens, session management
                                    </p>
                                </div>

                                <div className="medical-card p-6">
                                    <div className="flex items-start gap-3 mb-2">
                                        <FaCog className="text-black mt-1" />
                                        <h3 className="font-bold text-black font-space-grotesk">Functional Cookies</h3>
                                    </div>
                                    <p className="text-black font-inter mb-2">
                                        Remember your preferences and settings to provide enhanced, personalized features.
                                    </p>
                                    <p className="text-black font-inter text-sm opacity-70">
                                        <strong>Examples:</strong> Language preferences, theme settings
                                    </p>
                                </div>

                                <div className="medical-card p-6">
                                    <div className="flex items-start gap-3 mb-2">
                                        <FaCheckCircle className="text-black mt-1" />
                                        <h3 className="font-bold text-black font-space-grotesk">Analytics Cookies</h3>
                                    </div>
                                    <p className="text-black font-inter mb-2">
                                        Help us understand how visitors interact with our website by collecting and reporting information anonymously.
                                    </p>
                                    <p className="text-black font-inter text-sm opacity-70">
                                        <strong>Examples:</strong> Google Analytics, usage patterns
                                    </p>
                                </div>

                                <div className="medical-card p-6">
                                    <div className="flex items-start gap-3 mb-2">
                                        <FaCheckCircle className="text-black mt-1" />
                                        <h3 className="font-bold text-black font-space-grotesk">Marketing Cookies</h3>
                                    </div>
                                    <p className="text-black font-inter mb-2">
                                        Used to track visitorsacross websites to display relevant advertisements.
                                    </p>
                                    <p className="text-black font-inter text-sm opacity-70">
                                        <strong>Examples:</strong> Advertising platforms, retargeting
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* How We Use Cookies */}
                        <div>
                            <h2 className="text-2xl font-bold text-black mb-4 font-space-grotesk">How We Use Cookies</h2>
                            <ul className="list-disc list-inside space-y-2 text-black font-inter">
                                <li>Keep you signed in to your account</li>
                                <li>Remember your preferences and settings</li>
                                <li>Understand how you use our platform</li>
                                <li>Improve our services based on usage data</li>
                                <li>Provide personalized content and recommendations</li>
                                <li>Analyze platform performance and errors</li>
                            </ul>
                        </div>

                        {/* Managing Cookies */}
                        <div>
                            <h2 className="text-2xl font-bold text-black mb-4 font-space-grotesk">Managing Cookies</h2>
                            <div className="medical-card p-6 bg-yellow-400">
                                <p className="text-black font-inter mb-4">
                                    Most web browsers allow you to control cookies through their settings. You can:
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-black font-inter">
                                    <li>View what cookies are stored and delete them individually</li>
                                    <li>Block third-party cookies</li>
                                    <li>Block all cookies from specific websites</li>
                                    <li>Block all cookies entirely</li>
                                    <li>Delete all cookies when you close your browser</li>
                                </ul>
                                <p className="text-black font-inter mt-4 font-semibold">
                                    Note: Blocking cookies may affect your ability to use certain features of our platform.
                                </p>
                            </div>
                        </div>

                        {/* Third-Party Cookies */}
                        <div>
                            <h2 className="text-2xl font-bold text-black mb-4 font-space-grotesk">Third-Party Cookies</h2>
                            <p className="text-black font-inter leading-relaxed mb-4">
                                We may use third-party services that place cookies on your device:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-black font-inter">
                                <li><strong>Google Analytics</strong> - Website analytics</li>
                                <li><strong>Authentication Providers</strong> - Social login services</li>
                                <li><strong>Payment Processors</strong> - Secure payment handling</li>
                            </ul>
                        </div>

                        {/* Updates to Policy */}
                        <div>
                            <h2 className="text-2xl font-bold text-black mb-4 font-space-grotesk">Updates to This Policy</h2>
                            <p className="text-black font-inter leading-relaxed">
                                We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.
                            </p>
                        </div>

                        {/* Contact */}
                        <div className="medical-card p-8 bg-yellow-400">
                            <h3 className="text-xl font-bold text-black mb-4 font-space-grotesk">Questions About Cookies?</h3>
                            <p className="text-black font-inter mb-4">
                                If you have questions about our use of cookies, please contact us:
                            </p>
                            <div className="space-y-2 text-black font-inter">
                                <p><strong>Email:</strong> <a href="mailto:meakashu22dotin@gmail.com" className="hover:text-yellow-600 transition-colors">meakashu22dotin@gmail.com</a></p>
                                <p><strong>Phone:</strong> <a href="tel:+917255003131" className="hover:text-yellow-600 transition-colors">+91 7255003131</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
