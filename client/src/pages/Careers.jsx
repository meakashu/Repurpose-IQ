import { FaRocket, FaBriefcase, FaHeart, FaUsers } from 'react-icons/fa';

export default function Careers() {
    const openings = [
        {
            title: 'Senior AI/ML Engineer',
            department: 'Engineering',
            location: 'Remote',
            type: 'Full-time',
            description: 'Build and optimize our multi-agent AI system for pharmaceutical intelligence'
        },
        {
            title: 'Pharmaceutical Data Scientist',
            department: 'Data Science',
            location: 'Remote',
            type: 'Full-time',
            description: 'Analyze clinical trials, patents, and market data to generate insights'
        },
        {
            title: 'Full Stack Developer',
            department: 'Engineering',
            location: 'Remote',
            type: 'Full-time',
            description: 'Develop and maintain our web platform and API infrastructure'
        },
        {
            title: 'Product Manager',
            department: 'Product',
            location: 'Hybrid',
            type: 'Full-time',
            description: 'Drive product strategy and roadmap for pharmaceutical intelligence features'
        },
    ];

    const benefits = [
        {
            icon: FaRocket,
            title: 'Cutting-Edge Technology',
            description: 'Work with the latest AI and pharmaceutical research tools'
        },
        {
            icon: FaBriefcase,
            title: 'Flexible Work',
            description: 'Remote-first culture with flexible hours'
        },
        {
            icon: FaHeart,
            title: 'Health & Wellness',
            description: 'Comprehensive health insurance and wellness programs'
        },
        {
            icon: FaUsers,
            title: 'Amazing Team',
            description: 'Collaborate with brilliant minds in AI and pharma'
        },
    ];

    return (
        <div className="min-h-screen bg-yellow-400">
            {/* Hero */}
            <section className="border-b-2 border-black bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20 text-center">
                    <h1 className="text-4xl lg:text-6xl font-bold text-black mb-6 font-space-grotesk">
                        Join Our Mission
                    </h1>
                    <p className="text-xl lg:text-2xl text-black font-inter max-w-3xl mx-auto">
                        Help us transform pharmaceutical research with AI. Build the future of drug repurposing intelligence.
                    </p>
                </div>
            </section>

            {/* Benefits */}
            <section className="bg-white border-b-2 border-black">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
                    <h2 className="text-3xl font-bold text-black mb-12 text-center font-space-grotesk">
                        Why Join RepurposeIQ?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {benefits.map((benefit, idx) => {
                            const Icon = benefit.icon;
                            return (
                                <div key={idx} className="medical-card p-6 text-center">
                                    <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center mx-auto mb-4">
                                        <Icon className="text-yellow-400 text-2xl" />
                                    </div>
                                    <h3 className="text-xl font-bold text-black mb-3 font-space-grotesk">
                                        {benefit.title}
                                    </h3>
                                    <p className="text-black font-inter text-sm">
                                        {benefit.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Open Positions */}
            <section className="bg-yellow-400 border-b-2 border-black">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
                    <h2 className="text-3xl font-bold text-black mb-12 text-center font-space-grotesk">
                        Open Positions
                    </h2>
                    <div className="space-y-6">
                        {openings.map((job, idx) => (
                            <div key={idx} className="medical-card p-8">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-bold text-black mb-2 font-space-grotesk">
                                            {job.title}
                                        </h3>
                                        <div className="flex flex-wrap gap-3 mb-4">
                                            <span className="px-3 py-1 bg-black text-yellow-400 rounded-full text-sm font-semibold">
                                                {job.department}
                                            </span>
                                            <span className="px-3 py-1 bg-yellow-400 text-black rounded-full text-sm font-semibold border-2 border-black">
                                                {job.location}
                                            </span>
                                            <span className="px-3 py-1 bg-white text-black rounded-full text-sm font-semibold border-2 border-black">
                                                {job.type}
                                            </span>
                                        </div>
                                        <p className="text-black font-inter">
                                            {job.description}
                                        </p>
                                    </div>
                                    <button className="btn-medical-primary px-8 py-3 whitespace-nowrap">
                                        Apply Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact for Careers */}
            <section className="bg-black text-yellow-400">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 text-center">
                    <h2 className="text-3xl lg:text-4xl font-bold mb-6 font-space-grotesk">
                        Don't See a Perfect Fit?
                    </h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto font-inter">
                        We're always looking for exceptional talent. Send us your resume anyway!
                    </p>
                    <a href="mailto:meakashu22dotin@gmail.com" className="bg-yellow-400 text-black px-8 py-4 rounded-full text-lg font-bold hover:bg-white transition-all border-2 border-yellow-400 font-space-grotesk inline-block">
                        Email Your Resume
                    </a>
                </div>
            </section>
        </div>
    );
}
