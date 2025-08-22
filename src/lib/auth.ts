import { writable } from "svelte/store";
import { supabase, type Member } from "$lib/supabase";

// User store
export const user = writable<Member | null>(null);
export const loading = writable(true);

// Initialize auth state
export async function initializeAuth() {
  try {
    // Get current session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
      // Fetch user data from our custom users table using auth_id
      const { data: userData, error } = await supabase
        .from("users")
        .select("*")
        .eq("auth_id", session.user.id)
        .single();

      if (error) throw error;
      user.set(userData);
    } else {
      user.set(null);
    }
  } catch (error) {
    console.error("Error initializing auth:", error);
    user.set(null);
  } finally {
    loading.set(false);
  }
}

// Sign in
export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    console.log("Attempting to sign in with email:", email);

    if (error) throw error;

    if (data.user) {
      // Fetch user data from our custom users table using auth_id
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("auth_id", data.user.id)
        .single();

      if (userError) throw userError;
      user.set(userData);
    }

    return { success: true };
  } catch (error) {
    console.error("Sign in error:", error);
    return { success: false, error };
  }
}

// Sign out
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    user.set(null);
    return { success: true };
  } catch (error) {
    console.error("Sign out error:", error);
    return { success: false, error };
  }
}

// Role checking functions
export function hasRole(userRole: string, requiredRole: string): boolean {
  const roleHierarchy = {
    member: 1,
    admin: 2,
    super_admin: 3,
  };

  return (
    roleHierarchy[userRole as keyof typeof roleHierarchy] >=
    roleHierarchy[requiredRole as keyof typeof roleHierarchy]
  );
}

export function isMember(userRole: string): boolean {
  return hasRole(userRole, "member");
}

export function isAdmin(userRole: string): boolean {
  return hasRole(userRole, "admin");
}

export function isSuperAdmin(userRole: string): boolean {
  return hasRole(userRole, "super_admin");
}

// Permission checking functions
export function canViewProfile(userRole: string): boolean {
  return isMember(userRole);
}

export function canUpdateProfile(userRole: string): boolean {
  return isMember(userRole);
}

export function canSubmitProjects(userRole: string): boolean {
  return isMember(userRole);
}

export function canManageEvents(userRole: string): boolean {
  return isAdmin(userRole);
}

export function canModerateBlogs(userRole: string): boolean {
  return isAdmin(userRole);
}

export function canInviteMembers(userRole: string): boolean {
  return isSuperAdmin(userRole);
}

// Listen for auth changes
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === "SIGNED_IN" && session?.user) {
    const { data: userData, error } = await supabase
      .from("users")
      .select("*")
      .eq("auth_id", session.user.id)
      .single();

    if (!error && userData) {
      user.set(userData);
    }
  } else if (event === "SIGNED_OUT") {
    user.set(null);
  }
});
