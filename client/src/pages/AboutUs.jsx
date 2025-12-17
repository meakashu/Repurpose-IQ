import { useNavigate } from 'react-router-dom';
import { FaUsers, FaLightbulb, FaRocket, FaHandshake, FaArrowRight } from 'react-icons/fa';

export default function About() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="bg-yellow-400 border-b-2 border-black relative overflow-hidden">
                <div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                        backgroundImage: 'url(/images/hero-molecular-pattern.png)',
                        backgroundSize: '400px',
                        backgroundRepeat: 'repeat'
                    }}
                />
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-32 relative z-10 text-center">
                    <h1 className="text-5xl lg:text-7xl font-bold text-black mb-8 font-space-grotesk leading-tight">
                        REDEFINING DRUG DISCOVERY
                    </h1>
                    <p className="text-xl lg:text-2xl text-black font-inter max-w-3xl mx-auto leading-relaxed">
                        RepurposeIQ combines advanced multi-agent AI with deep pharmaceutical intelligence to accelerate the identification of new uses for existing drugs.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 lg:py-32 border-b-2 border-black">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-4xl lg:text-5xl font-bold text-black mb-8 font-space-grotesk">
                                Our Mission
                            </h2>
                            <p className="text-lg text-black font-inter leading-relaxed mb-6">
                                The pharmaceutical industry spends billions of dollars and over a decade to bring a single new drug to market. Meanwhile, thousands of approved and clinical-stage drugs sit on shelves, their full potential unexplored.
                            </p>
                            <p className="text-lg text-black font-inter leading-relaxed mb-8">
                                At RepurposeIQ, we believe the cure for many diseases already exists—it just hasn't been discovered yet. Our mission is to use Artificial Intelligence to uncover these hidden connections, drastically reducing the time and cost of bringing life-saving treatments to patients.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center text-yellow-400">
                                        <FaLightbulb className="text-2xl" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold font-space-grotesk">Innovation</h4>
                                        <p className="text-sm">AI-driven insights</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center text-yellow-400">
                                        <FaRocket className="text-2xl" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold font-space-grotesk">Speed</h4>
                                        <p className="text-sm">Faster to market</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-yellow-400 rounded-2xl transform translate-x-4 translate-y-4 border-2 border-black"></div>
                            <div className="bg-white border-2 border-black rounded-2xl p-8 relative z-10">
                                <h3 className="text-2xl font-bold mb-6 font-space-grotesk">Why Repurposing?</h3>
                                <ul className="space-y-4">
                                    {[
                                        "Reduced Safety Risk: Known safety profiles from previous trials.",
                                        "Faster Development: 3-5 years compared to 10-15 years for new drugs.",
                                        "Lower Cost: Significant reduction in R&D expenditure.",
                                        "Higher Success Rate: 25% approval rate vs 10% for new molecular entities."
                                    ].map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <span className="w-6 h-6 rounded-full bg-yellow-400 border border-black flex items-center justify-center flex-shrink-0 mt-1">
                                                <span className="text-xs font-bold">✓</span>
                                            </span>
                                            <span className="font-inter text-black">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="bg-gray-50 py-20 lg:py-32 border-b-2 border-black">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
                    <h2 className="text-4xl lg:text-5xl font-bold text-black mb-16 font-space-grotesk">
                        Meet The Team
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* Team Member 1 */}
                        <div className="medical-card bg-white p-8 group hover:-translate-y-2 transition-all">
                            <div className="w-32 h-32 mx-auto bg-black rounded-full mb-6 border-4 border-yellow-400 overflow-hidden relative">
                                <FaUsers className="text-4xl text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                            </div>
                            <h3 className="text-2xl font-bold font-space-grotesk mb-2">Akash Kumar Singh</h3>
                            <p className="text-yellow-600 font-bold font-inter text-sm uppercase tracking-wide mb-4">Founder & Lead Architect</p>
                            <p className="text-gray-600 font-inter text-sm">
                                Visionary leader driving the integration of AI agents into pharmaceutical research workflows.
                            </p>
                        </div>

                        {/* Placeholder for others */}
                        <div className="medical-card bg-white p-8 group hover:-translate-y-2 transition-all opacity-80">
                            <div className="w-32 h-32 mx-auto bg-gray-200 rounded-full mb-6 border-4 border-gray-400 flex items-center justify-center">
                                <span className="text-4xl text-gray-400">?</span>
                            </div>
                            <h3 className="text-2xl font-bold font-space-grotesk mb-2">Join Our Team</h3>
                            <p className="text-yellow-600 font-bold font-inter text-sm uppercase tracking-wide mb-4">We are Hiring</p>
                            <p className="text-gray-600 font-inter text-sm">
                                Looking for talented AI engineers and pharmaceutical researchers.
                            </p>
                        </div>

                        <div className="medical-card bg-white p-8 group hover:-translate-y-2 transition-all opacity-80">
                            <div className="w-32 h-32 mx-auto bg-gray-200 rounded-full mb-6 border-4 border-gray-400 flex items-center justify-center">
                                <span className="text-4xl text-gray-400">?</span>
                            </div>
                            <h3 className="text-2xl font-bold font-space-grotesk mb-2">Join Our Team</h3>
                            <p className="text-yellow-600 font-bold font-inter text-sm uppercase tracking-wide mb-4">We are Hiring</p>
                            <p className="text-gray-600 font-inter text-sm">
                                Looking for talented AI engineers and pharmaceutical researchers.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-black text-white py-20 lg:py-24">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold font-space-grotesk mb-8">Ready to Accelerate Your Research?</h2>
                    <button
                        onClick={() => navigate('/contact')}
                        className="bg-yellow-400 text-black px-10 py-5 rounded-full text-xl font-bold hover:bg-white transition-all transform hover:scale-105"
                    >
                        Contact Us <FaArrowRight className="inline ml-2" />
                    </button>
                </div>
            </section>
        </div>
    );
}
