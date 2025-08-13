// src/routes/members/+page.server.ts
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

// Define interfaces directly in the server file
interface Member {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'editor' | 'viewer';
}

type Role = Member['role'];

// replace with real DB in production
let members: Member[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'editor' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'viewer' }
];

export const load: PageServerLoad = async ({ url }) => {
    const search = url.searchParams.get('search') || '';
    const searchTerm = search.toLowerCase();
    
    const filteredMembers = members.filter(member => 
        member.name.toLowerCase().includes(searchTerm) ||
        member.email.toLowerCase().includes(searchTerm) ||
        member.role.toLowerCase().includes(searchTerm)
    );
    
    return { members: filteredMembers, search };
};

export const actions: Actions = {
    add: async ({ request }) => {
        const data = await request.formData();
        const name = data.get('name') as string;
        const email = data.get('email') as string;
        const role = data.get('role') as Role;
        
        if (!name || !email || !role) {
            return { error: 'All fields are required' };
        }
        
        if (!validateEmail(email)) {
            return { error: 'Invalid email format' };
        }
        
        const newMember: Member = {
            id: members.length > 0 ? Math.max(...members.map(m => m.id)) + 1 : 1,
            name,
            email,
            role
        };
        
        members.push(newMember);
        
        return { success: true };
    },
    
    delete: async ({ request }) => {
        const data = await request.formData();
        const id = Number(data.get('id'));
        
        members = members.filter(member => member.id !== id);
        
        return { success: true };
    }
};

function validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}