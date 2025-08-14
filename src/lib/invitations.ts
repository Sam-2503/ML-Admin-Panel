import { supabase } from "./supabase";

export interface Invitation {
  id: number;
  email: string;
  role: "member" | "admin";
  invited_by: number; // users.id (int8)
  accepted: boolean;
  created_at: string;
}

// Create invitation (Super Admin only)
export async function createInvitation(
  email: string,
  role: "member" | "admin",
  invitedBy: number
) {
  try {
    const { data, error } = await supabase
      .from("invitations")
      .insert({
        email,
        role,
        invited_by: invitedBy,
        accepted: false,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, invitation: data };
  } catch (error) {
    console.error("Error creating invitation:", error);
    return { success: false, error };
  }
}

// Get all invitations (Super Admin only)
export async function getAllInvitations() {
  try {
    const { data, error } = await supabase
      .from("invitations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { success: true, invitations: data };
  } catch (error) {
    console.error("Error getting invitations:", error);
    return { success: false, error };
  }
}

// Delete invitation (Super Admin only)
export async function deleteInvitation(invitationId: number) {
  try {
    const { error } = await supabase
      .from("invitations")
      .delete()
      .eq("id", invitationId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Error deleting invitation:", error);
    return { success: false, error };
  }
}
