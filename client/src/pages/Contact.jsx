import { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../utils/api';

export default function Contact() {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/contact', {
                name: formData.name,
                email: formData.email,
                company: formData.subject, // Using subject as company field
                message: formData.message
            });
            
            toast.success(response.data.message || "Message sent successfully! We'll respond within 24-48 hours.");
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            console.error('Contact form error:', error);
            toast.error(error.response?.data?.error || 'Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <section className="bg-yellow-400 border-b-2 border-black py-20 text-center">
                <h1 className="text-5xl font-bold text-black font-space-grotesk mb-4">Get in Touch</h1>
                <p className="text-xl text-black font-inter max-w-2xl mx-auto">
                    Have questions about our platform or enterprise solutions? We're here to help.
                </p>
            </section>

            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* Contact Info */}
                    <div>
                        <h2 className="text-3xl font-bold text-black mb-8 font-space-grotesk">Contact Information</h2>
                        <div className="space-y-8">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center text-yellow-400 flex-shrink-0">
                                    <FaEnvelope className="text-xl" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">Email Us</h3>
                                    <p className="text-gray-600 mb-1">For general inquiries:</p>
                                    <a href="mailto:meakashu22dotin@gmail.com" className="text-black font-bold hover:text-yellow-600 transition-colors">
                                        meakashu22dotin@gmail.com
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center text-yellow-400 flex-shrink-0">
                                    <FaPhone className="text-xl" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">Call Us</h3>
                                    <p className="text-gray-600 mb-1">Mon-Fri from 9am to 6pm IST</p>
                                    <a href="tel:+917255003131" className="text-black font-bold hover:text-yellow-600 transition-colors">
                                        +91 7255003131
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center text-yellow-400 flex-shrink-0">
                                    <FaMapMarkerAlt className="text-xl" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">Visit Us</h3>
                                    <p className="text-gray-600">
                                        Bangalore, India<br />
                                        (By Appointment Only)
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 p-8 bg-black text-yellow-400 rounded-2xl relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold font-space-grotesk mb-4">Enterprise Solutions</h3>
                                <p className="mb-6 opacity-90">
                                    Looking for a custom deployment for your research team? Contact our sales team for a tailored demo.
                                </p>
                                <button className="bg-white text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors">
                                    Contact Sales
                                </button>
                            </div>
                            {/* Abstract pattern background */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400 rounded-full opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="medical-card bg-white p-8 lg:p-10 border-2 border-black">
                        <h2 className="text-2xl font-bold text-black mb-6 font-space-grotesk">Send us a Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-black">Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="medical-input w-full"
                                        placeholder="Your Name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-black">Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="medical-input w-full"
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-black">Subject</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="medical-input w-full"
                                    placeholder="How can we help?"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-black">Message</label>
                                <textarea
                                    required
                                    rows="5"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="medical-input w-full"
                                    placeholder="Tell us more about your inquiry..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-medical-primary w-full flex items-center justify-center gap-2 py-4 text-lg"
                            >
                                {loading ? 'Sending...' : (
                                    <>
                                        Send Message <FaPaperPlane />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
