import { FaRocket, FaBrain, FaChartLine, FaDatabase, FaNetworkWired, FaBell, FaFileAlt, FaSearch, FaMicroscope, FaLightbulb, FaCogs, FaBalanceScale } from 'react-icons/fa';

export default function Features() {
    const features = [
        {
            icon: FaBrain,
            title: '9 Specialized AI Agents',
            description: 'Market, Patent, Clinical, Social, Competitor, Web, EXIM, Internal, and Regulatory agents working together',
            benefits: ['Comprehensive analysis', 'Multi-source intelligence', 'Real-time insights']
        },
        {
            icon: FaChartLine,
            title: 'Market Intelligence',
            description: 'Analyze market size, growth trends, competition, and opportunities in real-time',
            benefits: ['CAGR analysis', 'Competitive landscape', 'Market segmentation']
        },
        {
            icon: FaMicroscope,
            title: 'Clinical Trial Monitoring',
            description: 'Track clinical trials globally with real-time alerts and comprehensive data',
            benefits: ['Phase tracking', 'Competitor monitoring', 'Success predictions']
        },
        {
            icon: FaFileAlt,
            title: 'Patent Analytics',
            description: 'Monitor patent landscape, expiry dates, and freedom-to-operate analysis',
            benefits: ['Patent lifecycle', 'FTO analysis', 'IP strategy']
        },
        {
            icon: FaNetworkWired,
            title: 'Knowledge Graph',
            description: 'Visualize relationships between drugs, diseases, proteins, and pathways',
            benefits: ['Network analysis', 'Target discovery', 'Pathway mapping']
        },
        {
            icon: FaBell,
            title: 'Real-time Alerts',
            description: 'Get notified about new trials, patent changes, and market movements',
            benefits: ['Custom alerts', 'Email notifications', 'Priority flagging']
        },
        {
            icon: FaDatabase,
            title: 'Comprehensive Database',
            description: 'Access millions of data points from clinical trials, patents, and publications',
            benefits: ['Multi-source data', 'Regular updates', 'Historical tracking']
        },
        {
            icon: FaSearch,
            title: 'Advanced Search',
            description: 'Natural language queries powered by AI to find exactly what you need',
            benefits: ['Semantic search', 'Multi-criteria filtering', 'Export capabilities']
        },
        {
            icon: FaBalanceScale,
            title: 'Molecule Comparison',
            description: 'Compare drugs side-by-side across multiple parameters',
            benefits: ['Multi-parameter analysis', 'Visual comparisons', 'Export reports']
        },
        {
            icon: FaCogs,
            title: 'Automated Workflows',
            description: 'Set up custom workflows for recurring research tasks',
            benefits: ['Task automation', 'Scheduled reports', 'Custom triggers']
        },
        {
            icon: FaLightbulb,
            title: 'Sentiment Analysis',
            description: 'Analyze social media and news sentiment about drugs and companies',
            benefits: ['Social listening', 'Trend detection', 'Reputation monitoring']
        },
        {
            icon: FaRocket,
            title: 'Predictive Analytics',
            description: 'AI-powered predictions for drug success, market trends, and opportunities',
            benefits: ['Success probability', 'Market forecasting', 'Risk assessment']
        },
    ];

    return (
        <div className="min-h-screen bg-yellow-400">
            {/* Hero */}
            <section className="border-b-2 border-black bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20">
                    <h1 className="text-4xl lg:text-6xl font-bold text-black mb-6 font-space-grotesk">
                        Platform Features
                    </h1>
                    <p className="text-xl lg:text-2xl text-black font-inter max-w-3xl">
                        Everything you need to accelerate drug repurposing research and pharmaceutical intelligence in one integrated platform.
                    </p>
                </div>
            </section>

            {/* Features Grid */}
            <section className="bg-white border-b-2 border-black">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, idx) => {
                            const Icon = feature.icon;
                            return (
                                <div key={idx} className="medical-card p-8">
                                    <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center mb-6">
                                        <Icon className="text-yellow-400 text-2xl" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-black mb-4 font-space-grotesk">
                                        {feature.title}
                                    </h3>
                                    <p className="text-black font-inter mb-6 leading-relaxed">
                                        {feature.description}
                                    </p>
                                    <ul className="space-y-2">
                                        {feature.benefits.map((benefit, bidx) => (
                                            <li key={bidx} className="flex items-center gap-2 text-black font-inter text-sm">
                                                <span className="text-black">✓</span>
                                                {benefit}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-black text-yellow-400">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 text-center">
                    <h2 className="text-3xl lg:text-4xl font-bold mb-6 font-space-grotesk">
                        Ready to Get Started?
                    </h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto font-inter">
                        Experience the platform and see how it can enhance your research workflow
                    </p>
                    <a href="/contact" className="bg-yellow-400 text-black px-8 py-4 rounded-full text-lg font-bold hover:bg-white transition-all border-2 border-yellow-400 font-space-grotesk inline-block">
                        Request Demo
                    </a>
                </div>
            </section>
        </div>
    );
}
