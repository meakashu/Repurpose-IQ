// High-quality mock data for fallback scenarios to ensure demo stability (EXPANDED DATASET)

// 1. DASHBOARD & MARKET DATA
export const mockDashboardData = {
    kpis: {
        totalMarket: 45200, // Updated to reflect broader scope
        avgCAGR: 6.8,
        totalPatents: 2450,
        activePatents: 1120,
        totalTrials: 3500
    },
    marketData: [
        // Endocrinology
        { molecule: 'Metformin', market_size_usd_mn: 3450, cagr_percent: 5.2, therapy_area: 'Endocrinology' },
        { molecule: 'Sitagliptin', market_size_usd_mn: 2800, cagr_percent: 3.8, therapy_area: 'Endocrinology' },
        { molecule: 'Semaglutide', market_size_usd_mn: 14500, cagr_percent: 18.5, therapy_area: 'Endocrinology' },

        // Oncology
        { molecule: 'Pembrolizumab', market_size_usd_mn: 21000, cagr_percent: 12.5, therapy_area: 'Oncology' },
        { molecule: 'Nivolumab', market_size_usd_mn: 8500, cagr_percent: 9.2, therapy_area: 'Oncology' },
        { molecule: 'Rituximab', market_size_usd_mn: 6200, cagr_percent: 4.1, therapy_area: 'Oncology' },

        // Cardiovascular
        { molecule: 'Rivaroxaban', market_size_usd_mn: 4500, cagr_percent: 2.1, therapy_area: 'Cardiovascular' },
        { molecule: 'Apixaban', market_size_usd_mn: 11200, cagr_percent: 6.5, therapy_area: 'Cardiovascular' },
        { molecule: 'Atorvastatin', market_size_usd_mn: 3200, cagr_percent: 1.5, therapy_area: 'Cardiovascular' },

        // Neurology
        { molecule: 'Donepezil', market_size_usd_mn: 900, cagr_percent: 3.2, therapy_area: 'Neurology' },
        { molecule: 'Memantine', market_size_usd_mn: 650, cagr_percent: 2.8, therapy_area: 'Neurology' },

        // Immunology
        { molecule: 'Adalimumab', market_size_usd_mn: 18000, cagr_percent: -2.5, therapy_area: 'Immunology' }, // Patent cliff example
        { molecule: 'Infliximab', market_size_usd_mn: 4200, cagr_percent: 1.2, therapy_area: 'Immunology' }
    ]
};

// 2. ANALYTICS STATS
export const mockAnalyticsStats = {
    total_queries: 2845,
    queries_today: 142,
    avg_response_time: 980,
    api_usage: {
        groq: { global_calls: 1850, global_limit: 5000 },
        tavily: { global_calls: 420, global_limit: 1000 },
        pubmed: { global_calls: 840, global_limit: 2000 }
    },
    agent_usage: {
        'IQVIA Insights Agent': 950,
        'Clinical Trials Agent': 720,
        'EXIM Trends Agent': 580,
        'Web Intelligence Agent': 450,
        'Patent Landscape Agent': 310
    },
    popular_terms: [
        { term: 'GLP-1 Agonists', count: 210 },
        { term: 'Metformin anti-aging', count: 185 },
        { term: 'Alzheimers Phase 3', count: 140 },
        { term: 'Biosimilar Landscape', count: 115 },
        { term: 'Rare Disease Orphan Status', count: 90 }
    ],
    exim_data: [
        { molecule: 'Metformin', source_country: 'China', import_vol_mt: 12000, trend: '+5%' },
        { molecule: 'Paracetamol', source_country: 'India', import_vol_mt: 8500, trend: '-2%' },
        { molecule: 'Amoxicillin', source_country: 'China', import_vol_mt: 4200, trend: '+3%' },
        { molecule: 'Ibuprofen', source_country: 'India', import_vol_mt: 3800, trend: '+1.5%' },
        { molecule: 'Omeprazole', source_country: 'Spain', import_vol_mt: 1200, trend: '-0.5%' }
    ]
};

// 3. MONITORING & ALERTS
export const mockMonitoringStatus = {
    isMonitoring: true,
    checkInterval: 600000,
    lastCheckTime: new Date().toISOString(),
    trackedMolecules: ['Metformin', 'Pembrolizumab', 'Semaglutide', 'Rivaroxaban', 'Adalimumab']
};

export const mockAlerts = [
    { id: 1, type: 'CLINICAL', title: 'New Phase 3 Trial for Metformin', message: 'University of Oxford initiated a new trial for Metformin in Longevity (TAME).', date: new Date().toISOString(), viewed: false },
    { id: 2, type: 'PATENT', title: 'Patent Expiry Alert', message: 'Key patent for Sitagliptin expiring in EU region within 6 months.', date: new Date(Date.now() - 3600000).toISOString(), viewed: false },
    { id: 3, type: 'MARKET', title: 'Competitor Price Drop', message: 'Generic entrant for Rivaroxaban gaining market share in APAC region.', date: new Date(Date.now() - 86400000).toISOString(), viewed: true },
    { id: 4, type: 'REGULATORY', title: 'FDA Approval', message: 'Semaglutide approved for new obesity indication.', date: new Date(Date.now() - 172800000).toISOString(), viewed: true },
    { id: 5, type: 'SCIENCE', title: 'New Publication', message: 'Nature Medicine: Immunotherapy combination shows promise in resistant melanoma.', date: new Date(Date.now() - 259200000).toISOString(), viewed: true }
];

// 4. SYNTHETIC QUERIES
export const mockSyntheticQueries = [
    { id: 1, category: "Market Intelligence", query: "Which respiratory diseases show low competition but high patient burden in India?" },
    { id: 2, category: "Drug Repurposing", query: "Identify repurposing opportunities for Metformin beyond diabetes type 2." },
    { id: 3, category: "Patent Analysis", query: "What are the patent expiry timelines for leading cardiovascular drugs in the EU?" },
    { id: 4, category: "Market Entry", query: "Show me the CAGR trends for oncology biosimilars in the US market over the last 5 years." },
    { id: 5, category: "Clinical Trials", query: "Which clinical trials for Alzheimer's drugs have failed in Phase 3 recently?" },
    { id: 6, category: "Supply Chain", query: "Find API suppliers for Sitagliptin in Southeast Asia with export volume > 1000MT." },
    { id: 7, category: "Regulatory", query: "Summarize the latest FDA guidelines for AI in drug discovery." },
    { id: 8, category: "Competitive Intelligence", query: "Analyze the competitive landscape for JAK inhibitors in dermatology." },
    { id: 9, category: "R&D Discovery", query: "What emerging pathways are being targeted for fibrosis treatment?" },
    { id: 10, category: "Pipeline Analysis", query: "List all ongoing Phase 2 trials for RNA therapeutics in rare diseases." }
];

// 5. SENTIMENT DATA (Dynamic Dictionary)
export const mockSentimentDatabase = {
    'Metformin': {
        result: {
            overallSentiment: 'positive',
            sentimentScore: 0.82,
            sources: {
                news: { sentiment: 'positive', keyPoints: ['TAME trial funding secured', 'Growing interest in anti-aging applications'] },
                social: { sentiment: 'neutral', keyPoints: ['Patients discussing life-extension benefits', 'Concerns about GI side effects'] }
            },
            keyTopics: ['Longevity', 'Anti-aging', 'Diabetes', 'MTOR Pathway']
        },
        history: Array.from({ length: 30 }, (_, i) => ({
            created_at: new Date(Date.now() - (29 - i) * 86400000).toISOString(),
            sentiment_score: 0.7 + Math.random() * 0.2
        }))
    },
    'Semaglutide': {
        result: {
            overallSentiment: 'very-positive',
            sentimentScore: 0.95,
            sources: {
                news: { sentiment: 'positive', keyPoints: ['Record sales reported', 'New indication approval expected'] },
                social: { sentiment: 'mixed', keyPoints: ['Viral weight loss trends', 'Supply shortage complaints'] }
            },
            keyTopics: ['Obesity', 'Weight Loss', 'Supply Chain', 'Lifestyle']
        },
        history: Array.from({ length: 30 }, (_, i) => ({
            created_at: new Date(Date.now() - (29 - i) * 86400000).toISOString(),
            sentiment_score: 0.8 + Math.random() * 0.15
        }))
    },
    'Adalimumab': {
        result: {
            overallSentiment: 'negative',
            sentimentScore: -0.2,
            sources: {
                news: { sentiment: 'negative', keyPoints: ['Biosimilar competition intensifying', 'Market share erosion'] },
                social: { sentiment: 'positive', keyPoints: ['Patients switching to cheaper biosimilars', 'Proven efficacy'] }
            },
            keyTopics: ['Biosimilars', 'Patent Cliff', 'Cost', 'Accessibility']
        },
        history: Array.from({ length: 30 }, (_, i) => ({
            created_at: new Date(Date.now() - (29 - i) * 86400000).toISOString(),
            sentiment_score: 0.3 - Math.random() * 0.4
        }))
    },
    'default': {
        result: {
            overallSentiment: 'neutral',
            sentimentScore: 0.5,
            sources: {
                news: { sentiment: 'neutral', keyPoints: ['Stable market performance', 'Routine regulatory updates'] },
                social: { sentiment: 'neutral', keyPoints: ['Standard patient discussions', 'No major viral trends'] }
            },
            keyTopics: ['General Market', 'Efficacy', 'Safety']
        },
        history: Array.from({ length: 30 }, (_, i) => ({
            created_at: new Date(Date.now() - (29 - i) * 86400000).toISOString(),
            sentiment_score: 0.4 + Math.random() * 0.2
        }))
    }
};

// 6. WORKFLOWS
export const mockWorkflows = [
    {
        id: 1,
        name: 'Weekly Competitor Scan',
        description: 'Monitors key competitor trial updates every Monday.',
        status: 'active',
        enabled: true,
        runCount: 12,
        lastRun: new Date().toISOString(),
        schedule: '0 9 * * 1'
    },
    {
        id: 2,
        name: 'Patent Expiry Alert System',
        description: 'Checks for new patent filings in target therapy areas.',
        status: 'idle',
        enabled: true,
        runCount: 5,
        lastRun: new Date(Date.now() - 604800000).toISOString(),
        schedule: '0 0 1 * *'
    },
    {
        id: 3,
        name: 'Regulatory Guideline Scraper',
        description: 'Scrapes FDA/EMA websites for new guidance documents.',
        status: 'active',
        enabled: true,
        runCount: 24,
        lastRun: new Date(Date.now() - 86400000).toISOString(),
        schedule: '0 12 * * *'
    }
];

// 7. KNOWLEDGE GRAPH
export const mockGraphData = {
    paths: [
        { length: 2, path: [{ id: 'Metformin', type: 'Drug' }, { id: 'AMPK Activation', type: 'Mechanism' }, { id: 'Fibrosis', type: 'Disease' }] },
        { length: 3, path: [{ id: 'Metformin', type: 'Drug' }, { id: 'Insulin Sensitivity', type: 'phenotype' }, { id: 'PCOS', type: 'Disease' }] },
        { length: 3, path: [{ id: 'Metformin', type: 'Drug' }, { id: 'mTOR Inhibition', type: 'Mechanism' }, { id: 'Longevity', type: 'Outcome' }] }
    ],
    similar_drugs: ['Rapamycin', 'Resveratrol', 'Berberine', 'Acarbose', 'Canagliflozin']
};

// 8. FORECAST DATA
export const mockForecastData = {
    forecast: [
        { year: 1, forecasted_size: 1100, lower_bound: 1050, upper_bound: 1150 },
        { year: 2, forecasted_size: 1250, lower_bound: 1180, upper_bound: 1320 },
        { year: 3, forecasted_size: 1450, lower_bound: 1350, upper_bound: 1550 },
        { year: 4, forecasted_size: 1700, lower_bound: 1550, upper_bound: 1850 },
        { year: 5, forecasted_size: 2000, lower_bound: 1800, upper_bound: 2200 }
    ]
};
