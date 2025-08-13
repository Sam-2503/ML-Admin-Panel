// src/types/projects.ts
export interface Project {
    id: number;
    title: string;
    description: string;
    tech: string[];
    github_url?: string;
    demo_url?: string;
    created_at: Date;
    updated_at: Date;
    member_id: number;
}

export interface ProjectFormData {
    title: string;
    description: string;
    tech: string;
    github_url?: string;
    demo_url?: string;
}

export interface ProjectsResponse {
    projects: Project[];
}

export interface ProjectResponse {
    project: Project;
}