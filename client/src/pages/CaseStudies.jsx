export default function CaseStudies() {
    const cases = [
        {
            company: 'Global Pharma Inc.',
            challenge: 'Identify repurposing opportunities for their cardiovascular drug portfolio',
            solution: 'Used RepurposeIQ to analyze market data, clinical trials, and patent landscape',
            results: [
                'Discovered 5 new indication opportunities',
                'Reduced research time by 60%',
                'Identified $200M market opportunity',
            ],
            testimonial: 'RepurposeIQ transformed how we approach drug repurposing. The AI-powered insights are game-changing.',
            author: 'Dr. Sarah Johnson, VP of Research',
        },
        {
            company: 'BioTech Innovations',
            challenge: 'Monitor competitive landscape and clinical trial activity in oncology',
            solution: 'Implemented real-time monitoring and automated alerts for competitor activities',
            results: [
                'Real-time competitive intelligence',
                '80% faster patent analysis',
                'Early detection of 12 potential threats',
            ],
            testimonial: 'The platform pays for itself with just one early competitive insight.',
            author: 'Mark Chen, Chief Strategy Officer',
        },
        {
            company: 'MedResearch Solutions',
            challenge: 'Accelerate drug discovery process and reduce costs',
            solution: 'Leveraged RepurposeIQ\'s multi-agent AI system for comprehensive analysis',
            results: [
                '40% reduction in research costs',
                'Faster time-to-market by 8 months',
                'Improved success rate by 25%',
            ],
            testimonial: 'This platform is the future of pharmaceutical intelligence.',
            author: 'Dr. Emily Rodriguez, Director of Innovation',
        },
    ];

    return (
        <div className="min-h-screen bg-yellow-400">
            {/* Hero */}
            <section className="border-b-2 border-black bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20 text-center">
                    <h1 className="text-4xl lg:text-6xl font-bold text-black mb-6 font-space-grotesk">
                        Success Stories
                    </h1>
                    <p className="text-xl lg:text-2xl text-black font-inter max-w-3xl mx-auto">
                        See how leading pharmaceutical companies are accelerating drug repurposing with RepurposeIQ.
                    </p>
                </div>
            </section>

            {/* Case Studies */}
            <section className="bg-white border-b-2 border-black">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
                    <div className="space-y-12">
                        {cases.map((caseStudy, idx) => (
                            <div key={idx} className="medical-card p-8 lg:p-12">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Left Side */}
                                    <div>
                                        <h2 className="text-3xl font-bold text-black mb-4 font-space-grotesk">
                                            {caseStudy.company}
                                        </h2>

                                        <div className="mb-6">
                                            <h3 className="text-xl font-bold text-black mb-2 font-space-grotesk">Challenge</h3>
                                            <p className="text-black font-inter">
                                                {caseStudy.challenge}
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="text-xl font-bold text-black mb-2 font-space-grotesk">Solution</h3>
                                            <p className="text-black font-inter">
                                                {caseStudy.solution}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right Side */}
                                    <div>
                                        <div className="bg-yellow-400 p-6 rounded-lg border-2 border-black mb-6">
                                            <h3 className="text-xl font-bold text-black mb-4 font-space-grotesk">Results</h3>
                                            <ul className="space-y-3">
                                                {caseStudy.results.map((result, ridx) => (
                                                    <li key={ridx} className="flex items-center gap-3 text-black font-inter font-semibold">
                                                        <span className="text-black text-2xl">✓</span>
                                                        {result}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="border-l-4 border-black pl-6">
                                            <p className="text-lg text-black font-inter italic mb-4">
                                                "{caseStudy.testimonial}"
                                            </p>
                                            <p className="text-black font-inter font-semibold">
                                                — {caseStudy.author}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-black text-yellow-400">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 text-center">
                    <h2 className="text-3xl lg:text-4xl font-bold mb-6 font-space-grotesk">
                        Ready to Write Your Success Story?
                    </h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto font-inter">
                        Explore how our AI-powered platform can enhance pharmaceutical research
                    </p>
                    <a href="/contact" className="bg-yellow-400 text-black px-8 py-4 rounded-full text-lg font-bold hover:bg-white transition-all border-2 border-yellow-400 font-space-grotesk inline-block">
                        Get Started
                    </a>
                </div>
            </section>
        </div>
    );
}
