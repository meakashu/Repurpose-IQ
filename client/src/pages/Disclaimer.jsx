import { FaExclamationTriangle, FaEnvelope } from 'react-icons/fa';

export default function Disclaimer() {
    return (
        <div className="min-h-screen bg-yellow-400">
            {/* Hero */}
            <section className="border-b-2 border-black bg-white">
                <div className="max-w-4xl mx-auto px-6 lg:px-12 py-16 lg:py-20">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-yellow-400 rounded-lg border-2 border-black flex items-center justify-center">
                            <FaExclamationTriangle className="text-black text-2xl" />
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold text-black font-space-grotesk">Disclaimer</h1>
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
                        {/* Medical Disclaimer */}
                        <div>
                            <h2 className="text-2xl font-bold text-black mb-4 font-space-grotesk">Medical Disclaimer</h2>
                            <p className="text-black font-inter leading-relaxed mb-4">
                                RepurposeIQ is a pharmaceutical intelligence platform designed to support research and decision-making processes. <strong>This platform does not provide medical advice, diagnosis, or treatment recommendations.</strong>
                            </p>
                        </div>

                        {/* Important Notices */}
                        <div>
                            <h3 className="text-xl font-bold text-black mb-4 font-space-grotesk">Important Notices</h3>
                            <div className="space-y-4">
                                <div className="medical-card p-6">
                                    <h4 className="font-bold text-black mb-2 font-space-grotesk">1. Not Medical Advice</h4>
                                    <p className="text-black font-inter">
                                        Information provided through RepurposeIQ is for research and informational purposes only. It is not intended to replace professional medical advice, diagnosis, or treatment.
                                    </p>
                                </div>

                                <div className="medical-card p-6">
                                    <h4 className="font-bold text-black mb-2 font-space-grotesk">2. Consult Professionals</h4>
                                    <p className="text-black font-inter">
                                        Always seek the advice of qualified healthcare providers and regulatory experts before making any pharmaceutical or medical decisions.
                                    </p>
                                </div>

                                <div className="medical-card p-6">
                                    <h4 className="font-bold text-black mb-2 font-space-grotesk">3. AI-Generated Content</h4>
                                    <p className="text-black font-inter">
                                        Our platform uses artificial intelligence to analyze and synthesize information. While we strive for accuracy, AI-generated content may contain errors or incomplete information.
                                    </p>
                                </div>

                                <div className="medical-card p-6">
                                    <h4 className="font-bold text-black mb-2 font-space-grotesk">4. No Guarantees</h4>
                                    <p className="text-black font-inter">
                                        We make no representations or warranties about the accuracy, reliability, completeness, or timeliness of the information provided.
                                    </p>
                                </div>

                                <div className="medical-card p-6">
                                    <h4 className="font-bold text-black mb-2 font-space-grotesk">5. Research Purposes</h4>
                                    <p className="text-black font-inter">
                                        Information should be used as a starting point for in-depth research and professional consultation, not as definitive guidance.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Data Sources */}
                        <div>
                            <h3 className="text-xl font-bold text-black mb-4 font-space-grotesk">Data Sources Disclaimer</h3>
                            <p className="text-black font-inter leading-relaxed mb-4">
                                RepurposeIQ aggregates data from multiple sources including:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-black font-inter mb-4">
                                <li>Published scientific literature</li>
                                <li>Clinical trial databases</li>
                                <li>Patent databases</li>
                                <li>Market research reports</li>
                                <li>Regulatory filings</li>
                            </ul>
                            <p className="text-black font-inter leading-relaxed font-semibold">
                                We do not guarantee the accuracy, completeness, or currency of third-party data.
                            </p>
                        </div>

                        {/* Regulatory Compliance */}
                        <div>
                            <h3 className="text-xl font-bold text-black mb-4 font-space-grotesk">Regulatory Compliance</h3>
                            <p className="text-black font-inter leading-relaxed">
                                This platform provides general information about regulatory pathways and requirements. <strong>It does not constitute legal or regulatory advice.</strong> Always consult with regulatory affairs professionals and legal counsel for specific guidance.
                            </p>
                        </div>

                        {/* Investment Disclaimer */}
                        <div>
                            <h3 className="text-xl font-bold text-black mb-4 font-space-grotesk">Investment Disclaimer</h3>
                            <p className="text-black font-inter leading-relaxed">
                                Market analysis and financial projections provided should not be considered investment advice. Consult financial advisors before making investment decisions.
                            </p>
                        </div>

                        {/* Limitation of Liability */}
                        <div>
                            <h3 className="text-xl font-bold text-black mb-4 font-space-grotesk">Limitation of Liability</h3>
                            <p className="text-black font-inter leading-relaxed">
                                RepurposeIQ, its officers, directors, employees, and affiliates shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of this platform.
                            </p>
                        </div>

                        {/* No Professional Relationship */}
                        <div>
                            <h3 className="text-xl font-bold text-black mb-4 font-space-grotesk">No Doctor-Patient Relationship</h3>
                            <p className="text-black font-inter leading-relaxed">
                                Use of this platform does not create a doctor-patient, advisor-client, or any professional relationship.
                            </p>
                        </div>

                        {/* Changes */}
                        <div>
                            <h3 className="text-xl font-bold text-black mb-4 font-space-grotesk">Changes to Disclaimer</h3>
                            <p className="text-black font-inter leading-relaxed">
                                We reserve the right to modify this disclaimer at any time. Check this page regularly for updates.
                            </p>
                        </div>

                        {/* Contact */}
                        <div className="medical-card p-8 bg-yellow-400">
                            <div className="flex items-start gap-4">
                                <FaEnvelope className="text-black text-2xl flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-xl font-bold text-black mb-2 font-space-grotesk">Questions About This Disclaimer?</h3>
                                    <p className="text-black font-inter mb-4">
                                        If you have any questions or concerns about this disclaimer, please contact us:
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
