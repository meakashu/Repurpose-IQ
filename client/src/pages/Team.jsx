import { FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa';

export default function Team() {
    const team = [
        {
            name: 'Akash Kumar Singh',
            role: 'Founder & CEO',
            bio: 'Leading the vision for AI-powered pharmaceutical intelligence',
            email: 'meakashu22dotin@gmail.com',
            phone: '+91 7255003131',
            image: '👨‍💼'
        },
        // Add more team members as needed
    ];

    return (
        <div className="min-h-screen bg-yellow-400">
            {/* Hero */}
            <section className="border-b-2 border-black bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20 text-center">
                    <h1 className="text-4xl lg:text-6xl font-bold text-black mb-6 font-space-grotesk">
                        Meet Our Team
                    </h1>
                    <p className="text-xl lg:text-2xl text-black font-inter max-w-3xl mx-auto">
                        The brilliant minds behind RepurposeIQ, dedicated to transforming pharmaceutical research with AI.
                    </p>
                </div>
            </section>

            {/* Team Grid */}
            <section className="bg-white border-b-2 border-black">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {team.map((member, idx) => (
                            <div key={idx} className="medical-card p-8 text-center">
                                <div className="w-32 h-32 bg-yellow-400 rounded-full flex items-center justify-center text-6xl mx-auto mb-6 border-4 border-black">
                                    {member.image}
                                </div>
                                <h3 className="text-2xl font-bold text-black mb-2 font-space-grotesk">
                                    {member.name}
                                </h3>
                                <p className="text-black font-semibold mb-4 font-inter">
                                    {member.role}
                                </p>
                                <p className="text-black font-inter mb-6 leading-relaxed">
                                    {member.bio}
                                </p>
                                <div className="space-y-2 text-sm text-black font-inter">
                                    <div className="flex items-center justify-center gap-2">
                                        <FaEnvelope />
                                        <a href={`mailto:${member.email}`} className="hover:text-yellow-600 transition-colors">
                                            {member.email}
                                        </a>
                                    </div>
                                    {member.phone && (
                                        <div className="flex items-center justify-center gap-2">
                                            <span>📱</span>
                                            <a href={`tel:${member.phone}`} className="hover:text-yellow-600 transition-colors">
                                                {member.phone}
                                            </a>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center justify-center gap-4 mt-6">
                                    <a href="#" className="w-10 h-10 bg-black rounded-full flex items-center justify-center hover:bg-yellow-600 transition-colors">
                                        <FaLinkedin className="text-yellow-400" />
                                    </a>
                                    <a href="#" className="w-10 h-10 bg-black rounded-full flex items-center justify-center hover:bg-yellow-600 transition-colors">
                                        <FaTwitter className="text-yellow-400" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Join Team CTA */}
            <section className="bg-black text-yellow-400">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 text-center">
                    <h2 className="text-3xl lg:text-4xl font-bold mb-6 font-space-grotesk">
                        Want to Join Our Team?
                    </h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto font-inter">
                        We're always looking for talented individuals passionate about AI and pharmaceutical research
                    </p>
                    <a href="/careers" className="bg-yellow-400 text-black px-8 py-4 rounded-full text-lg font-bold hover:bg-white transition-all border-2 border-yellow-400 font-space-grotesk inline-block">
                        View Open Positions
                    </a>
                </div>
            </section>
        </div>
    );
}
