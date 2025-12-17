import { useState } from 'react';
import { FaCheck } from 'react-icons/fa';

export default function Pricing() {
    const [billingCycle, setBillingCycle] = useState('monthly');

    const plans = [
        {
            name: 'Starter',
            description: 'Perfect for individual researchers',
            monthlyPrice: 499,
            annualPrice: 4990,
            features: [
                'Up to 500 queries/month',
                'Access to 5 AI agents',
                'Basic analytics dashboard',
                'Email support',
                'Export to PDF/Excel',
                '1 user account',
            ],
            cta: 'Contact Sales',
            popular: false,
        },
        {
            name: 'Professional',
            description: 'For growing pharmaceutical companies',
            monthlyPrice: 1499,
            annualPrice: 14990,
            features: [
                'Up to 2,000 queries/month',
                'Access to all 9 AI agents',
                'Advanced analytics & reports',
                'Priority email & chat support',
                'Custom workflows',
                'API access (10k calls/month)',
                'Up to 5 user accounts',
                'Knowledge graph access',
                'Real-time alerts',
            ],
            cta: 'Contact Sales',
            popular: true,
        },
        {
            name: 'Enterprise',
            description: 'For large organizations',
            monthlyPrice: null,
            annualPrice: null,
            features: [
                'Unlimited queries',
                'All features included',
                'Dedicated account manager',
                '24/7 phone & email support',
                'Custom integrations',
                'Unlimited API calls',
                'Unlimited user accounts',
                'SSO & advanced security',
                'Custom training sessions',
                'SLA guarantee',
                'On-premise deployment option',
            ],
            cta: 'Contact Sales',
            popular: false,
        },
    ];

    return (
        <div className="min-h-screen bg-yellow-400">
            {/* Hero */}
            <section className="border-b-2 border-black bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20 text-center">
                    <h1 className="text-4xl lg:text-6xl font-bold text-black mb-6 font-space-grotesk">
                        Simple, Transparent Pricing
                    </h1>
                    <p className="text-xl lg:text-2xl text-black font-inter max-w-3xl mx-auto mb-8">
                        Choose the plan that fits your research needs.
                    </p>

                    {/* Billing Toggle */}
                    <div className="inline-flex items-center gap-4 medical-card p-2">
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            className={`px-6 py-3 rounded-full font-semibold transition-all ${billingCycle === 'monthly'
                                ? 'bg-black text-yellow-400'
                                : 'text-black hover:bg-yellow-400'
                                }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingCycle('annual')}
                            className={`px-6 py-3 rounded-full font-semibold transition-all ${billingCycle === 'annual'
                                ? 'bg-black text-yellow-400'
                                : 'text-black hover:bg-yellow-400'
                                }`}
                        >
                            Annual <span className="text-sm">(Save 17%)</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="bg-white border-b-2 border-black">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {plans.map((plan, idx) => (
                            <div
                                key={idx}
                                className={`medical-card p-8 ${plan.popular ? 'ring-4 ring-black relative' : ''
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <span className="bg-black text-yellow-400 px-4 py-1 rounded-full text-sm font-bold">
                                            MOST POPULAR
                                        </span>
                                    </div>
                                )}

                                <h3 className="text-2xl font-bold text-black mb-2 font-space-grotesk">
                                    {plan.name}
                                </h3>
                                <p className="text-black font-inter text-sm mb-6">
                                    {plan.description}
                                </p>

                                <div className="mb-6">
                                    {plan.monthlyPrice ? (
                                        <>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-5xl font-bold text-black font-space-grotesk">
                                                    ${billingCycle === 'monthly' ? plan.monthlyPrice : Math.floor(plan.annualPrice / 12)}
                                                </span>
                                                <span className="text-black font-inter">/month</span>
                                            </div>
                                            {billingCycle === 'annual' && (
                                                <p className="text-sm text-black opacity-70 mt-2 font-inter">
                                                    Billed annually at ${plan.annualPrice}
                                                </p>
                                            )}
                                        </>
                                    ) : (
                                        <div className="text-5xl font-bold text-black font-space-grotesk">
                                            Custom
                                        </div>
                                    )}
                                </div>

                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, fidx) => (
                                        <li key={fidx} className="flex items-start gap-3 text-black font-inter">
                                            <FaCheck className="text-black mt-1 flex-shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    className={`w-full py-4 rounded-full font-bold text-lg transition-all ${plan.popular
                                        ? 'btn-medical-primary'
                                        : 'btn-medical-secondary'
                                        }`}
                                >
                                    {plan.cta}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="bg-yellow-400 border-b-2 border-black">
                <div className="max-w-4xl mx-auto px-6 lg:px-12 py-16">
                    <h2 className="text-3xl font-bold text-black mb-8 text-center font-space-grotesk">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-6">
                        <div className="medical-card p-6">
                            <h3 className="font-bold text-black mb-2 font-space-grotesk">Can I change plans later?</h3>
                            <p className="text-black font-inter">Yes, you can upgrade or downgrade your plan at any time.</p>
                        </div>
                        <div className="medical-card p-6">
                            <h3 className="font-bold text-black mb-2 font-space-grotesk">How do I get started?</h3>
                            <p className="text-black font-inter">Contact us to discuss your requirements and get access to the platform.</p>
                        </div>
                        <div className="medical-card p-6">
                            <h3 className="font-bold text-black mb-2 font-space-grotesk">What payment methods do you accept?</h3>
                            <p className="text-black font-inter">We accept all major credit cards, bank transfers, and purchase orders for Enterprise plans.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
