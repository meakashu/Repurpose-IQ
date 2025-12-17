import { FaFileContract, FaEnvelope } from 'react-icons/fa';

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-yellow-400">
            {/* Hero */}
            <section className="border-b-2 border-black bg-white">
                <div className="max-w-4xl mx-auto px-6 lg:px-12 py-16 lg:py-20">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center">
                            <FaFileContract className="text-yellow-400 text-2xl" />
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold text-black font-space-grotesk">Terms of Service</h1>
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
                        {/* Acceptance */}
                        <div>
                            <h2 className="text-2xl font-bold text-black mb-4 font-space-grotesk">1. Acceptance of Terms</h2>
                            <p className="text-black font-inter leading-relaxed">
                                By accessing or using RepurposeIQ ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the Service.
                            </p>
                        </div>

                        {/* Service Description */}
                        <div>
                            <h2 className="text-2xl font-bold text-black mb-4 font-space-grotesk">2. Service Description</h2>
                            <p className="text-black font-inter leading-relaxed mb-4">
                                RepurposeIQ is a pharmaceutical intelligence platform that provides:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-black font-inter">
                                <li>AI-powered drug repurposing insights</li>
                                <li>Market analysis and competitive intelligence</li>
                                <li>Clinical trial monitoring</li>
                                <li>Patent landscape analysis</li>
                                <li>Regulatory intelligence</li>
                            </ul>
                        </div>

                        {/* User Accounts */}
                        <div>
                            <h2 className="text-2xl font-bold text-black mb-4 font-space-grotesk">3. User Accounts</h2>
                            <div className="medical-card p-6">
                                <h3 className="font-bold text-black mb-3 font-space-grotesk">3.1 Account Creation</h3>
                                <p className="text-black font-inter mb-4">
                                    You must create an account to use the Service. You agree to provide accurate, current, and complete information.
                                </p>

                                <h3 className="font-bold text-black mb-3 font-space-grotesk">3.2 Account Security</h3>
                                <p className="text-black font-inter mb-4">
                                    You are responsible for maintaining the confidentiality of your account credentials. Notify us immediately of any unauthorized access.
                                </p>

                                <h3 className="font-bold text-black mb-3 font-space-grotesk">3.3 Account Responsibilities</h3>
                                <p className="text-black font-inter">
                                    You are responsible for all activities that occur under your account.
                                </p>
                            </div>
                        </div>

                        {/* Acceptable Use */}
                        <div>
                            <h2 className="text-2xl font-bold text-black mb-4 font-space-grotesk">4. Acceptable Use Policy</h2>
                            <p className="text-black font-inter leading-relaxed mb-4">
                                You agree NOT to:
                            </p>
                            <div className="space-y-3">
                                <div className="flex gap-3">
                                    <span className="text-black">✗</span>
                                    <p className="text-black font-inter">Use the Service for any unlawful purpose</p>
                                </div>
                                <div className="flex gap-3">
                                    <span className="text-black">✗</span>
                                    <p className="text-black font-inter">Attempt to gain unauthorized access to the Service</p>
                                </div>
                                <div className="flex gap-3">
                                    <span className="text-black">✗</span>
                                    <p className="text-black font-inter">Interfere with or disrupt the Service</p>
                                </div>
                                <div className="flex gap-3">
                                    <span className="text-black">✗</span>
                                    <p className="text-black font-inter">Upload viruses or malicious code</p>
                                </div>
                                <div className="flex gap-3">
                                    <span className="text-black">✗</span>
                                    <p className="text-black font-inter">Scrape or reverse engineer the Service</p>
                                </div>
                                <div className="flex gap-3">
                                    <span className="text-black">✗</span>
                                    <p className="text-black font-inter">Share your account with others</p>
                                </div>
                            </div>
                        </div>

                        {/* Intellectual Property */}
                        <div>
                            <h2 className="text-2xl font-bold text-black mb-4 font-space-grotesk">5. Intellectual Property</h2>
                            <div className="medical-card p-6">
                                <h3 className="font-bold text-black mb-3 font-space-grotesk">5.1 Our IP</h3>
                                <p className="text-black font-inter mb-4">
                                    The Service, including all content, features, and functionality, is owned by RepurposeIQ and protected by copyright, trademark, and other intellectual property laws.
                                </p>

                                <h3 className="font-bold text-black mb-3 font-space-grotesk">5.2 Your Content</h3>
                                <p className="text-black font-inter mb-4">
                                    You retain ownership of any content you upload. By uploading content, you grant us a license to use it to provide the Service.
                                </p>

                                <h3 className="font-bold text-black mb-3 font-space-grotesk">5.3 Feedback</h3>
                                <p className="text-black font-inter">
                                    Any feedback or suggestions you provide may be used by us without obligation to you.
                                </p>
                            </div>
                        </div>

                        {/* Payment Terms */}
                        <div>
                            <h2 className="text-2xl font-bold text-black mb-4 font-space-grotesk">6. Payment Terms</h2>
                            <p className="text-black font-inter leading-relaxed mb-4">
                                If you subscribe to a paid plan:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-black font-inter">
                                <li>Fees are charged in advance on a recurring basis</li>
                                <li>All fees are non-refundable except as required by law</li>
                                <li>We may change our fees with 30 days notice</li>
                                <li>Failed payments may result in service suspension</li>
                            </ul>
                        </div>

                        {/* Limitation of Liability */}
                        <div>
                            <h2 className="text-2xl font-bold text-black mb-4 font-space-grotesk">7. Limitation of Liability</h2>
                            <div className="medical-card p-6 bg-yellow-400">
                                <p className="text-black font-inter leading-relaxed font-semibold mb-4">
                                    TO THE MAXIMUM EXTENT PERMITTED BY LAW:
                                </p>
                                <p className="text-black font-inter leading-relaxed">
                                    RepurposeIQ shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including lost profits, data loss, or business interruption, arising from your use or inability to use the Service.
                                </p>
                            </div>
                        </div>

                        {/* Warranties Disclaimer */}
                        <div>
                            <h2 className="text-2xl font-bold text-black mb-4 font-space-grotesk">8. Warranties Disclaimer</h2>
                            <p className="text-black font-inter leading-relaxed">
                                THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
                            </p>
                        </div>

                        {/* Termination */}
                        <div>
                            <h2 className="text-2xl font-bold text-black mb-4 font-space-grotesk">9. Termination</h2>
                            <p className="text-black font-inter leading-relaxed mb-4">
                                We may terminate or suspend your account at any time, with or without cause or notice, for violation of these Terms or other reasons.
                            </p>
                            <p className="text-black font-inter leading-relaxed">
                                You may terminate your account at any time through your account settings.
                            </p>
                        </div>

                        {/* Dispute Resolution */}
                        <div>
                            <h2 className="text-2xl font-bold text-black mb-4 font-space-grotesk">10. Dispute Resolution</h2>
                            <div className="medical-card p-6">
                                <h3 className="font-bold text-black mb-3 font-space-grotesk">10.1 Governing Law</h3>
                                <p className="text-black font-inter mb-4">
                                    These Terms are governed by the laws of the State of California, USA, without regard to conflict of law provisions.
                                </p>

                                <h3 className="font-bold text-black mb-3 font-space-grotesk">10.2 Arbitration</h3>
                                <p className="text-black font-inter">
                                    Any disputes shall be resolved through binding arbitration in San Francisco, California.
                                </p>
                            </div>
                        </div>

                        {/* Changes to Terms */}
                        <div>
                            <h2 className="text-2xl font-bold text-black mb-4 font-space-grotesk">11. Changes to Terms</h2>
                            <p className="text-black font-inter leading-relaxed">
                                We reserve the right to modify these Terms at any time. We will notify you of material changes via email or prominent notice on the Service. Continued use of the Service after changes constitutes acceptance.
                            </p>
                        </div>

                        {/* Contact */}
                        <div className="medical-card p-8 bg-yellow-400">
                            <div className="flex items-start gap-4">
                                <FaEnvelope className="text-black text-2xl flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-xl font-bold text-black mb-2 font-space-grotesk">Questions About These Terms?</h3>
                                    <p className="text-black font-inter mb-4">
                                        If you have questions about these Terms of Service, please contact us:
                                    </p>
                                    <a href="mailto:legal@repurposeiq.com" className="text-black font-bold hover:text-yellow-600 transition-colors">
                                        legal@repurposeiq.com
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
