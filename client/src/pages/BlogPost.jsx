import { useParams, useNavigate } from 'react-router-dom';
import { blogPosts } from '../data/blogData';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FaArrowLeft, FaCalendar, FaUser, FaTag, FaShareAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function BlogPost() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const post = blogPosts.find(p => p.slug === slug);

    if (!post) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4">Post not found</h2>
                    <button onClick={() => navigate('/blog')} className="btn-medical-primary">Return to Blog</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Progress Bar (simple) */}
            <motion.div
                className="fixed top-0 left-0 h-1 bg-yellow-400 z-50 transform origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5 }}
            />

            <article className="max-w-4xl mx-auto px-6 py-12 lg:py-20">
                {/* Header */}
                <button
                    onClick={() => navigate('/blog')}
                    className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-8 font-bold text-sm uppercase tracking-wide"
                >
                    <FaArrowLeft /> Back to Insights
                </button>

                <header className="mb-12 text-center">
                    <div className="inline-flex items-center gap-2 bg-black text-yellow-400 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                        <FaTag /> {post.category}
                    </div>
                    <h1 className="text-3xl lg:text-5xl font-bold font-space-grotesk leading-tight mb-6">
                        {post.title}
                    </h1>

                    <div className="flex items-center justify-center gap-6 text-sm text-gray-500 font-inter border-b pb-8">
                        <span className="flex items-center gap-2">
                            <FaUser className="text-black" />
                            <span className="font-semibold text-black">{post.author}</span>
                        </span>
                        <span className="flex items-center gap-2">
                            <FaCalendar className="text-black" />
                            {post.date}
                        </span>
                    </div>
                </header>

                {/* Featured Image */}
                <div className="mb-12 rounded-2xl overflow-hidden border-2 border-black shadow-xl">
                    <img src={post.image} alt={post.title} className="w-full h-[400px] object-cover" />
                </div>

                {/* Content */}
                <div className="prose prose-lg max-w-none prose-headings:font-space-grotesk prose-headings:font-bold prose-p:font-inter prose-a:text-yellow-600 prose-blockquote:border-l-4 prose-blockquote:border-yellow-400 prose-blockquote:bg-gray-50 prose-blockquote:p-4 prose-blockquote:italic">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {post.content}
                    </ReactMarkdown>
                </div>

                {/* Footer */}
                <div className="mt-16 pt-8 border-t-2 border-dashed border-gray-200 flex justify-between items-center">
                    <div className="font-bold font-space-grotesk text-xl">Share this article</div>
                    <div className="flex gap-4">
                        <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-black hover:text-yellow-400 transition-all">
                            <FaShareAlt />
                        </button>
                        {/* Add more social buttons if needed */}
                    </div>
                </div>
            </article>

            {/* CTA */}
            <section className="bg-yellow-50 py-16 border-t-2 border-black">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h3 className="text-3xl font-bold font-space-grotesk mb-4">Interested in this topic?</h3>
                    <p className="text-lg text-gray-600 mb-8">
                        See how RepurposeIQ can apply these insights to your drug discovery pipeline.
                    </p>
                    <button onClick={() => navigate('/contact')} className="btn-medical-primary px-8 py-3">
                        Contact Our Team
                    </button>
                </div>
            </section>
        </div>
    );
}
