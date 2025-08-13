import type { Member } from "./member";

export interface Project {
    id: number;
    title: string;
    description: string;
    status: 'draft' | 'submitted' | 'approved' | 'rejected';
    createdBy: Member['id'];
    createdAt: Date;
    updatedAt: Date;
    attachments?: string[];
}

export type ProjectStatus = Project['status'];