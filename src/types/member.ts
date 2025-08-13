export interface Member {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'moderator' | 'member';
    joined_at: Date;
    last_active: Date;
    status: 'active' | 'inactive' | 'banned';
}