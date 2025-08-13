// src/routes/projects/+page.server.ts
import type { Actions, PageServerLoad } from './$types';

// Define interfaces directly in the server file
interface Project {
    id: number;
    title: string;
    description: string;
    author: string;
    status: 'pending' | 'approved' | 'rejected';
    submittedDate: string;
    category: string;
    githubUrl: string;
}

// Dummy data - replace with real DB in production
let projects: Project[] = [
    {
        id: 1,
        title: "Machine Learning Image Classifier",
        description: "A CNN-based image classification system using TensorFlow and Python",
        author: "John Doe",
        status: "pending",
        submittedDate: "2024-01-15",
        category: "Computer Vision",
        githubUrl: "https://github.com/johndoe/ml-image-classifier"
    },
    {
        id: 2,
        title: "Natural Language Processing Chatbot",
        description: "An AI chatbot using BERT and transformers for customer service",
        author: "Jane Smith",
        status: "approved",
        submittedDate: "2024-01-10",
        category: "NLP",
        githubUrl: "https://github.com/janesmith/nlp-chatbot"
    },
    {
        id: 3,
        title: "Recommendation System",
        description: "Collaborative filtering recommendation engine for e-commerce",
        author: "Mike Johnson",
        status: "rejected",
        submittedDate: "2024-01-08",
        category: "Recommendation Systems",
        githubUrl: "https://github.com/mikejohnson/rec-system"
    },
    {
        id: 4,
        title: "Time Series Forecasting",
        description: "LSTM-based forecasting model for stock price prediction",
        author: "Sarah Wilson",
        status: "pending",
        submittedDate: "2024-01-12",
        category: "Time Series",
        githubUrl: "https://github.com/sarahwilson/time-series-forecast"
    }
];

export const load: PageServerLoad = async ({ url }) => {
    const search = url.searchParams.get('search') || '';
    const statusFilter = url.searchParams.get('status') || 'all';
    const categoryFilter = url.searchParams.get('category') || 'all';
    
    let filteredProjects = projects;
    
    if (search) {
        const searchTerm = search.toLowerCase();
        filteredProjects = filteredProjects.filter(project => 
            project.title.toLowerCase().includes(searchTerm) ||
            project.author.toLowerCase().includes(searchTerm) ||
            project.description.toLowerCase().includes(searchTerm)
        );
    }
    
    if (statusFilter !== 'all') {
        filteredProjects = filteredProjects.filter(project => project.status === statusFilter);
    }
    
    if (categoryFilter !== 'all') {
        filteredProjects = filteredProjects.filter(project => project.category === categoryFilter);
    }
    
    return { 
        projects: filteredProjects, 
        search, 
        statusFilter, 
        categoryFilter,
        allProjects: projects 
    };
};

export const actions: Actions = {
    updateStatus: async ({ request }) => {
        const data = await request.formData();
        const id = Number(data.get('id'));
        const status = data.get('status') as Project['status'];
        
        if (!id || !status) {
            return { error: 'Invalid request data' };
        }
        
        const projectIndex = projects.findIndex(p => p.id === id);
        if (projectIndex !== -1) {
            projects[projectIndex].status = status;
        }
        
        return { success: true };
    },
    
    delete: async ({ request }) => {
        const data = await request.formData();
        const id = Number(data.get('id'));
        
        if (!id) {
            return { error: 'Invalid project ID' };
        }
        
        projects = projects.filter(project => project.id !== id);
        
        return { success: true };
    }
}; 