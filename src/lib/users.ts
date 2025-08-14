import { supabase, type User } from "./supabase";

// Get all users (Super Admin only)
export async function getAllUsers() {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { success: true, users: data };
  } catch (error) {
    console.error("Error getting users:", error);
    return { success: false, error };
  }
}

// Get user by auth_id
export async function getUserByAuthId(authId: string) {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("auth_id", authId)
      .single();

    if (error) throw error;

    return { success: true, user: data };
  } catch (error) {
    console.error("Error getting user:", error);
    return { success: false, error };
  }
}

// Update user role (Super Admin only)
export async function updateUserRole(
  userId: number,
  newRole: "member" | "admin" | "super_admin"
) {
  try {
    const { data, error } = await supabase
      .from("users")
      .update({ role: newRole })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;

    return { success: true, user: data };
  } catch (error) {
    console.error("Error updating user role:", error);
    return { success: false, error };
  }
}

// Delete user (Super Admin only)
export async function deleteUser(userId: number) {
  try {
    const { error: userError } = await supabase
      .from("users")
      .delete()
      .eq("id", userId);

    if (userError) throw userError;

    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error };
  }
}
