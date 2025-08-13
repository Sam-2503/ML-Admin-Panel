// src/routes/events/+page.server.ts
import type { Actions, PageServerLoad } from './$types';

// Define interfaces directly in the server file
interface Event {
    id: number;
    title: string;
    description: string;
    date: string;
    time: string;
    duration: string;
    location: string;
    capacity: number;
    registeredCount: number;
    status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
    category: string;
    organizer: string;
    imageUrl: string;
}

// Dummy data - replace with real DB in production
let events: Event[] = [
    {
        id: 1,
        title: "Introduction to Machine Learning Workshop",
        description: "A hands-on workshop covering the basics of ML algorithms and their applications",
        date: "2024-02-15",
        time: "14:00",
        duration: "3 hours",
        location: "Room 301, Engineering Building",
        capacity: 50,
        registeredCount: 35,
        status: "upcoming",
        category: "Workshop",
        organizer: "Dr. Sarah Chen",
        imageUrl: "/api/placeholder/400/200"
    },
    {
        id: 2,
        title: "AI Ethics Panel Discussion",
        description: "Join industry experts for a thought-provoking discussion on AI ethics and responsible AI development",
        date: "2024-02-20",
        time: "18:00",
        duration: "2 hours",
        location: "Auditorium A",
        capacity: 200,
        registeredCount: 180,
        status: "upcoming",
        category: "Panel Discussion",
        organizer: "Prof. Michael Rodriguez",
        imageUrl: "/api/placeholder/400/200"
    },
    {
        id: 3,
        title: "Deep Learning Hackathon",
        description: "24-hour hackathon focused on solving real-world problems using deep learning techniques",
        date: "2024-02-25",
        time: "09:00",
        duration: "24 hours",
        location: "Innovation Lab",
        capacity: 100,
        registeredCount: 95,
        status: "upcoming",
        category: "Hackathon",
        organizer: "ML Club Team",
        imageUrl: "/api/placeholder/400/200"
    },
    {
        id: 4,
        title: "Guest Lecture: Future of AI",
        description: "Renowned AI researcher Dr. Emily Watson shares insights on the future of artificial intelligence",
        date: "2024-01-30",
        time: "16:00",
        duration: "1.5 hours",
        location: "Lecture Hall B",
        capacity: 150,
        registeredCount: 150,
        status: "completed",
        category: "Guest Lecture",
        organizer: "Department of Computer Science",
        imageUrl: "/api/placeholder/400/200"
    },
    {
        id: 5,
        title: "Data Science Career Fair",
        description: "Connect with top companies hiring data scientists and ML engineers",
        date: "2024-03-10",
        time: "10:00",
        duration: "6 hours",
        location: "Student Center",
        capacity: 300,
        registeredCount: 250,
        status: "upcoming",
        category: "Career Fair",
        organizer: "Career Services",
        imageUrl: "/api/placeholder/400/200"
    }
];

export const load: PageServerLoad = async ({ url }) => {
    const search = url.searchParams.get('search') || '';
    const statusFilter = url.searchParams.get('status') || 'all';
    const categoryFilter = url.searchParams.get('category') || 'all';
    
    let filteredEvents = events;
    
    if (search) {
        const searchTerm = search.toLowerCase();
        filteredEvents = filteredEvents.filter(event => 
            event.title.toLowerCase().includes(searchTerm) ||
            event.description.toLowerCase().includes(searchTerm) ||
            event.organizer.toLowerCase().includes(searchTerm)
        );
    }
    
    if (statusFilter !== 'all') {
        filteredEvents = filteredEvents.filter(event => event.status === statusFilter);
    }
    
    if (categoryFilter !== 'all') {
        filteredEvents = filteredEvents.filter(event => event.category === categoryFilter);
    }
    
    return { 
        events: filteredEvents, 
        search, 
        statusFilter, 
        categoryFilter,
        allEvents: events 
    };
};

export const actions: Actions = {
    add: async ({ request }) => {
        const data = await request.formData();
        const title = data.get('title') as string;
        const description = data.get('description') as string;
        const date = data.get('date') as string;
        const time = data.get('time') as string;
        const duration = data.get('duration') as string;
        const location = data.get('location') as string;
        const capacity = Number(data.get('capacity'));
        const category = data.get('category') as string;
        const organizer = data.get('organizer') as string;
        
        if (!title || !description || !date || !time || !duration || !location || !capacity || !category || !organizer) {
            return { error: 'All fields are required' };
        }
        
        const newEvent: Event = {
            id: events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1,
            title,
            description,
            date,
            time,
            duration,
            location,
            capacity,
            registeredCount: 0,
            status: "upcoming",
            category,
            organizer,
            imageUrl: "/api/placeholder/400/200"
        };
        
        events.unshift(newEvent);
        
        return { success: true };
    },
    
    updateStatus: async ({ request }) => {
        const data = await request.formData();
        const id = Number(data.get('id'));
        const status = data.get('status') as Event['status'];
        
        if (!id || !status) {
            return { error: 'Invalid request data' };
        }
        
        const eventIndex = events.findIndex(e => e.id === id);
        if (eventIndex !== -1) {
            events[eventIndex].status = status;
        }
        
        return { success: true };
    },
    
    delete: async ({ request }) => {
        const data = await request.formData();
        const id = Number(data.get('id'));
        
        if (!id) {
            return { error: 'Invalid event ID' };
        }
        
        events = events.filter(event => event.id !== id);
        
        return { success: true };
    }
}; 