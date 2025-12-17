import { useNavigate } from 'react-router-dom';
import { blogPosts } from '../data/blogData';
import { FaArrowRight, FaCalendar, FaUser, FaTag } from 'react-icons/fa';

export default function BlogList() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero */}
            <section className="bg-yellow-400 border-b-2 border-black py-20 text-center relative overflow-hidden">
                <div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                        backgroundImage: 'url(/images/hero-molecular-pattern.png)',
                        backgroundSize: '400px',
                        backgroundRepeat: 'repeat'
                    }}
                />
                <div className="relative z-10 px-6">
                    <h1 className="text-5xl font-bold text-black font-space-grotesk mb-4">RepurposeIQ Insights</h1>
                    <p className="text-xl text-black font-inter max-w-2xl mx-auto">
                        Latest news, research, and analysis on AI-driven drug repurposing.
                    </p>
                </div>
            </section>

            {/* Blog Grid */}
            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts.map((post) => (
                        <article
                            key={post.id}
                            className="medical-card bg-white overflow-hidden group hover:-translate-y-2 transition-all cursor-pointer h-full flex flex-col"
                            onClick={() => navigate(`/blog/${post.slug}`)}
                        >
                            {/* Image */}
                            <div className="h-48 bg-black overflow-hidden border-b-2 border-black relative">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full border border-black uppercase tracking-wide">
                                        {post.category}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3 font-inter">
                                    <span className="flex items-center gap-1"><FaCalendar /> {post.date}</span>
                                    <span className="flex items-center gap-1"><FaUser /> {post.author}</span>
                                </div>

                                <h2 className="text-xl font-bold font-space-grotesk leading-tight mb-3 group-hover:text-yellow-600 transition-colors">
                                    {post.title}
                                </h2>

                                <p className="text-gray-600 font-inter text-sm mb-4 line-clamp-3 flex-1">
                                    {post.excerpt}
                                </p>

                                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-sm font-bold">
                                    <span className="text-black group-hover:underline decoration-yellow-400 decoration-2 underline-offset-4">Read Article</span>
                                    <FaArrowRight className="transform -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    );
}
