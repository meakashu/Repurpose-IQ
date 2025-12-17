import { FaCode, FaRocket, FaBook, FaKey } from 'react-icons/fa';

export default function ApiDocs() {
    const endpoints = [
        {
            method: 'POST',
            path: '/api/query',
            description: 'Submit a pharmaceutical intelligence query to the multi-agent system',
            auth: 'Required'
        },
        {
            method: 'GET',
            path: '/api/dashboard',
            description: 'Retrieve dashboard analytics and key metrics',
            auth: 'Required'
        },
        {
            method: 'GET',
            path: '/api/clinical-trials',
            description: 'Search and filter clinical trials data',
            auth: 'Required'
        },
        {
            method: 'GET',
            path: '/api/patents',
            description: 'Access patent information and analytics',
            auth: 'Required'
        },
        {
            method: 'GET',
            path: '/api/market-data',
            description: 'Get market size, CAGR, and competitive intelligence',
            auth: 'Required'
        },
    ];

    return (
        <div className="min-h-screen bg-yellow-400">
            {/* Hero */}
            <section className="border-b-2 border-black bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center">
                            <FaCode className="text-yellow-400 text-2xl" />
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-bold text-black font-space-grotesk">
                            API Documentation
                        </h1>
                    </div>
                    <p className="text-xl lg:text-2xl text-black font-inter max-w-3xl">
                        Integrate RepurposeIQ's pharmaceutical intelligence into your own applications with our RESTful API.
                    </p>
                </div>
            </section>

            {/* Getting Started */}
            <section className="bg-white border-b-2 border-black">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                        <div className="medical-card p-8">
                            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                                <FaKey className="text-yellow-400 text-xl" />
                            </div>
                            <h3 className="text-xl font-bold text-black mb-3 font-space-grotesk">1. Get API Key</h3>
                            <p className="text-black font-inter">
                                Generate your API key from your account settings dashboard
                            </p>
                        </div>

                        <div className="medical-card p-8">
                            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                                <FaCode className="text-yellow-400 text-xl" />
                            </div>
                            <h3 className="text-xl font-bold text-black mb-3 font-space-grotesk">2. Make Requests</h3>
                            <p className="text-black font-inter">
                                Use your API key in the Authorization header for all requests
                            </p>
                        </div>

                        <div className="medical-card p-8">
                            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                                <FaRocket className="text-yellow-400 text-xl" />
                            </div>
                            <h3 className="text-xl font-bold text-black mb-3 font-space-grotesk">3. Build Apps</h3>
                            <p className="text-black font-inter">
                                Integrate pharmaceutical intelligence into your workflows
                            </p>
                        </div>
                    </div>

                    {/* Authentication */}
                    <div className="medical-card p-8 mb-8">
                        <h2 className="text-2xl font-bold text-black mb-4 font-space-grotesk">Authentication</h2>
                        <p className="text-black font-inter mb-4">
                            All API requests must include your API key in the Authorization header:
                        </p>
                        <div className="bg-black text-yellow-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                            <code>Authorization: Bearer YOUR_API_KEY</code>
                        </div>
                    </div>

                    {/* Base URL */}
                    <div className="medical-card p-8 mb-8">
                        <h2 className="text-2xl font-bold text-black mb-4 font-space-grotesk">Base URL</h2>
                        <div className="bg-yellow-400 p-4 rounded-lg border-2 border-black">
                            <code className="text-black font-mono font-bold">https://api.repurposeiq.com/v1</code>
                        </div>
                    </div>

                    {/* Endpoints */}
                    <div className="medical-card p-8">
                        <h2 className="text-2xl font-bold text-black mb-6 font-space-grotesk">API Endpoints</h2>
                        <div className="space-y-4">
                            {endpoints.map((endpoint, idx) => (
                                <div key={idx} className="border-2 border-black rounded-lg p-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${endpoint.method === 'GET'
                                                ? 'bg-yellow-400 text-black'
                                                : 'bg-black text-yellow-400'
                                            }`}>
                                            {endpoint.method}
                                        </span>
                                        <code className="font-mono text-black font-semibold">{endpoint.path}</code>
                                    </div>
                                    <p className="text-black font-inter mb-2">{endpoint.description}</p>
                                    <span className="text-sm text-black opacity-70 font-inter">
                                        Authentication: <strong>{endpoint.auth}</strong>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Example Request */}
            <section className="bg-yellow-400 border-b-2 border-black">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
                    <div className="medical-card p-8">
                        <h2 className="text-2xl font-bold text-black mb-6 font-space-grotesk">Example Request</h2>
                        <div className="bg-black text-yellow-400 p-6 rounded-lg font-mono text-sm overflow-x-auto">
                            <pre>{`curl -X POST https://api.repurposeiq.com/v1/api/query \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "What are the market opportunities for Metformin in diabetes?",
    "agents": ["market", "clinical", "patent"]
  }'`}</pre>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-black text-yellow-400">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 text-center">
                    <h2 className="text-3xl lg:text-4xl font-bold mb-6 font-space-grotesk">
                        Need Help?
                    </h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto font-inter">
                        Contact our API support team for integration assistance
                    </p>
                    <a href="/contact" className="bg-yellow-400 text-black px-8 py-4 rounded-full text-lg font-bold hover:bg-white transition-all border-2 border-yellow-400 font-space-grotesk inline-block">
                        Contact Support
                    </a>
                </div>
            </section>
        </div>
    );
}
