import matter from 'gray-matter';

// Custom reading time calculator (browser-compatible)
function calculateReadingTime(text) {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
}

// Blog post metadata and content parser
export function parseBlogPost(markdownContent) {
    const { data, content } = matter(markdownContent);
    const readingTime = calculateReadingTime(content);

    return {
        frontmatter: data,
        content,
        readingTime,
    };
}

// Get all blog posts (in a real app, this would fetch from a CMS or file system)
export function getAllBlogPosts() {
    // For now, return sample posts metadata
    // In production, you'd read from /content/blog/*.md files
    return [
        {
            slug: 'future-drug-repurposing-ai',
            title: 'The Future of Drug Repurposing: How AI is Changing Pharmaceutical R&D',
            excerpt: 'Discover how artificial intelligence is revolutionizing drug discovery and reducing the $2.6 billion price tag of bringing new treatments to market.',
            author: 'Dr. Sarah Johnson',
            authorRole: 'Chief Scientific Officer',
            date: '2025-01-15',
            category: 'Drug Repurposing',
            tags: ['AI', 'Drug Discovery', 'Innovation'],
            image: '/images/blog/blog-drug-repurposing.png',
            readingTime: '8 min read',
        },
        {
            slug: 'clinical-trial-phases-guide',
            title: 'Understanding Clinical Trial Phases: A Complete Guide',
            excerpt: 'A comprehensive breakdown of clinical trial phases from Phase 0 exploratory studies through Phase IV post-market surveillance.',
            author: 'Dr. Michael Rodriguez',
            authorRole: 'Head of Clinical Research',
            date: '2025-01-20',
            category: 'Clinical Trials',
            tags: ['Research', 'FDA', 'Regulatory'],
            image: '/images/blog/blog-clinical-trials.png',
            readingTime: '10 min read',
        },
        {
            slug: 'patent-strategy-pharma-2025',
            title: 'Patent Strategy for Pharmaceutical Companies in 2025',
            excerpt: 'Navigate the complex world of pharmaceutical patents with insights on lifecycle management, FTO analysis, and generic competition.',
            author: 'Jennifer Lee',
            authorRole: 'IP Strategy Director',
            date: '2025-01-25',
            category: 'Patents & IP',
            tags: ['Patents', 'Strategy', 'Legal'],
            image: '/images/blog/blog-patent-strategy.png',
            readingTime: '12 min read',
        },
        {
            slug: 'market-analysis-pharma-opportunities',
            title: 'Market Analysis 101: Sizing Pharmaceutical Opportunities',
            excerpt: 'Learn how to identify whitespace opportunities and size pharmaceutical markets using TAM, SAM, SOM analysis and competitive intelligence.',
            author: 'Alex Chen',
            authorRole: 'Market Intelligence Lead',
            date: '2025-02-01',
            category: 'Market Analysis',
            tags: ['Business', 'Strategy', 'Analytics'],
            image: '/images/blog/blog-market-analysis.png',
            readingTime: '9 min read',
        },
        {
            slug: 'ai-pharma-research-reality',
            title: 'AI in Pharmaceutical Research: Separating Hype from Reality',
            excerpt: 'A realistic look at what AI can actually do in pharma today, common misconceptions, and what the next 5 years hold.',
            author: 'Dr. Sarah Johnson',
            authorRole: 'Chief Scientific Officer',
            date: '2025-02-05',
            category: 'AI in Pharma',
            tags: ['AI', 'Research', 'Innovation'],
            image: '/images/blog/blog-ai-pharma.png',
            readingTime: '11 min read',
        },
    ];
}

// Get single blog post by slug
export function getBlogPostBySlug(slug) {
    const posts = getAllBlogPosts();
    return posts.find(post => post.slug === slug);
}

// Get related posts
export function getRelatedPosts(currentSlug, category, limit = 3) {
    const posts = getAllBlogPosts();
    return posts
        .filter(post => post.slug !== currentSlug && post.category === category)
        .slice(0, limit);
}

// Filter posts by category
export function filterPostsByCategory(category) {
    const posts = getAllBlogPosts();
    if (!category || category === 'all') return posts;
    return posts.filter(post => post.category === category);
}

// Search posts
export function searchPosts(query) {
    const posts = getAllBlogPosts();
    const lowerQuery = query.toLowerCase();

    return posts.filter(post =>
        post.title.toLowerCase().includes(lowerQuery) ||
        post.excerpt.toLowerCase().includes(lowerQuery) ||
        post.category.toLowerCase().includes(lowerQuery) ||
        post.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
}

// Get unique categories
export function getCategories() {
    const posts = getAllBlogPosts();
    const categories = new Set(posts.map(post => post.category));
    return ['All', ...Array.from(categories)];
}
