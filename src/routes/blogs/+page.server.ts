// src/routes/blogs/+page.server.ts
import type { Actions, PageServerLoad } from './$types';

// Define interfaces directly in the server file
interface Blog {
    id: number;
    title: string;
    excerpt: string;
    author: string;
    status: 'pending' | 'approved' | 'rejected';
    submittedDate: string;
    category: string;
    readTime: string;
    tags: string[];
}

// Dummy data - replace with real DB in production
let blogs: Blog[] = [
    {
        id: 1,
        title: "Introduction to Deep Learning with PyTorch",
        excerpt: "A comprehensive guide to getting started with deep learning using PyTorch framework...",
        author: "Alice Johnson",
        status: "pending",
        submittedDate: "2024-01-20",
        category: "Deep Learning",
        readTime: "8 min read",
        tags: ["PyTorch", "Deep Learning", "Python"]
    },
    {
        id: 2,
        title: "Understanding Neural Network Architectures",
        excerpt: "Explore different neural network architectures from simple feedforward to complex transformers...",
        author: "Bob Chen",
        status: "approved",
        submittedDate: "2024-01-18",
        category: "Neural Networks",
        readTime: "12 min read",
        tags: ["Neural Networks", "Architecture", "AI"]
    },
    {
        id: 3,
        title: "Machine Learning in Healthcare: A Practical Guide",
        excerpt: "How machine learning is revolutionizing healthcare with real-world applications...",
        author: "Carol Williams",
        status: "rejected",
        submittedDate: "2024-01-15",
        category: "Healthcare ML",
        readTime: "15 min read",
        tags: ["Healthcare", "ML Applications", "Ethics"]
    },
    {
        id: 4,
        title: "Optimizing Hyperparameters with Bayesian Optimization",
        excerpt: "Advanced techniques for hyperparameter tuning using Bayesian optimization methods...",
        author: "David Kim",
        status: "pending",
        submittedDate: "2024-01-22",
        category: "Optimization",
        readTime: "10 min read",
        tags: ["Hyperparameters", "Bayesian", "Optimization"]
    },
    {
        id: 5,
        title: "Natural Language Processing for Beginners",
        excerpt: "Start your journey into NLP with this beginner-friendly introduction...",
        author: "Eva Rodriguez",
        status: "approved",
        submittedDate: "2024-01-16",
        category: "NLP",
        readTime: "6 min read",
        tags: ["NLP", "Beginners", "Text Processing"]
    }
];

export const load: PageServerLoad = async ({ url }) => {
    const search = url.searchParams.get('search') || '';
    const statusFilter = url.searchParams.get('status') || 'all';
    const categoryFilter = url.searchParams.get('category') || 'all';
    
    let filteredBlogs = blogs;
    
    if (search) {
        const searchTerm = search.toLowerCase();
        filteredBlogs = filteredBlogs.filter(blog => 
            blog.title.toLowerCase().includes(searchTerm) ||
            blog.author.toLowerCase().includes(searchTerm) ||
            blog.excerpt.toLowerCase().includes(searchTerm)
        );
    }
    
    if (statusFilter !== 'all') {
        filteredBlogs = filteredBlogs.filter(blog => blog.status === statusFilter);
    }
    
    if (categoryFilter !== 'all') {
        filteredBlogs = filteredBlogs.filter(blog => blog.category === categoryFilter);
    }
    
    return { 
        blogs: filteredBlogs, 
        search, 
        statusFilter, 
        categoryFilter,
        allBlogs: blogs 
    };
};

export const actions: Actions = {
    updateStatus: async ({ request }) => {
        const data = await request.formData();
        const id = Number(data.get('id'));
        const status = data.get('status') as Blog['status'];
        
        if (!id || !status) {
            return { error: 'Invalid request data' };
        }
        
        const blogIndex = blogs.findIndex(b => b.id === id);
        if (blogIndex !== -1) {
            blogs[blogIndex].status = status;
        }
        
        return { success: true };
    },
    
    delete: async ({ request }) => {
        const data = await request.formData();
        const id = Number(data.get('id'));
        
        if (!id) {
            return { error: 'Invalid blog ID' };
        }
        
        blogs = blogs.filter(blog => blog.id !== id);
        
        return { success: true };
    }
}; 