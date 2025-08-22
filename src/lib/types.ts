export type UserRole = "member" | "admin" | "super_admin";

export interface User {
  id: number; // int8 PK
  auth_id: string; // uuid, references auth.users.id
  email: string;
  role: UserRole;
  created_at: string;
}

export interface Session {
  user: User;
  expires: string;
}
