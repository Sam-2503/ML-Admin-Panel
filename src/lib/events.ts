import { supabase, type Event } from "./supabase";

// Create new event (Admins and Super Admins only)
export async function createEvent(
  eventData: Omit<Event, "id" | "created_at" | "updated_at">
) {
  try {
    const { data, error } = await supabase
      .from("events")
      .insert({
        ...eventData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, event: data };
  } catch (error) {
    console.error("Error creating event:", error);
    return { success: false, error };
  }
}

// Get all events (Everyone can view events)
export async function getAllEvents() {
  try {
    const { data, error } = await supabase
      .from("events")
      .select(
        `
        *,
        creator:users!events_created_by_fkey(email),
        profile:profiles!events_created_by_fkey(first_name, last_name)
      `
      )
      .order("date", { ascending: true });

    if (error) throw error;

    return { success: true, events: data };
  } catch (error) {
    console.error("Error getting events:", error);
    return { success: false, error };
  }
}

// Get event by ID
export async function getEventById(eventId: string) {
  try {
    const { data, error } = await supabase
      .from("events")
      .select(
        `
        *,
        creator:users!events_created_by_fkey(email),
        profile:profiles!events_created_by_fkey(first_name, last_name)
      `
      )
      .eq("id", eventId)
      .single();

    if (error) throw error;

    return { success: true, event: data };
  } catch (error) {
    console.error("Error getting event:", error);
    return { success: false, error };
  }
}

// Update event (Only the creator or admins/super_admins can update)
export async function updateEvent(
  eventId: string,
  eventData: Partial<Event>,
  userId: string,
  userRole?: string
) {
  try {
    // If not admin/super_admin, check if user is the creator
    if (userRole && userRole !== "admin" && userRole !== "super_admin") {
      const { data: existingEvent, error: checkError } = await supabase
        .from("events")
        .select("created_by")
        .eq("id", eventId)
        .single();

      if (checkError) throw checkError;

      if (existingEvent.created_by !== userId) {
        return {
          success: false,
          error: "You can only update events you created",
        };
      }
    }

    const { data, error } = await supabase
      .from("events")
      .update({
        ...eventData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", eventId)
      .select()
      .single();

    if (error) throw error;

    return { success: true, event: data };
  } catch (error) {
    console.error("Error updating event:", error);
    return { success: false, error };
  }
}

// Delete event (Only the creator or admins/super_admins can delete)
export async function deleteEvent(
  eventId: string,
  userId: string,
  userRole?: string
) {
  try {
    // If not admin/super_admin, check if user is the creator
    if (userRole && userRole !== "admin" && userRole !== "super_admin") {
      const { data: existingEvent, error: checkError } = await supabase
        .from("events")
        .select("created_by")
        .eq("id", eventId)
        .single();

      if (checkError) throw checkError;

      if (existingEvent.created_by !== userId) {
        return {
          success: false,
          error: "You can only delete events you created",
        };
      }
    }

    const { error } = await supabase.from("events").delete().eq("id", eventId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Error deleting event:", error);
    return { success: false, error };
  }
}

// Get upcoming events
export async function getUpcomingEvents() {
  try {
    const { data, error } = await supabase
      .from("events")
      .select(
        `
        *,
        creator:users!events_created_by_fkey(email),
        profile:profiles!events_created_by_fkey(first_name, last_name)
      `
      )
      .gte("date", new Date().toISOString())
      .order("date", { ascending: true });

    if (error) throw error;

    return { success: true, events: data };
  } catch (error) {
    console.error("Error getting upcoming events:", error);
    return { success: false, error };
  }
}

// Get past events
export async function getPastEvents() {
  try {
    const { data, error } = await supabase
      .from("events")
      .select(
        `
        *,
        creator:users!events_created_by_fkey(email),
        profile:profiles!events_created_by_fkey(first_name, last_name)
      `
      )
      .lt("date", new Date().toISOString())
      .order("date", { ascending: false });

    if (error) throw error;

    return { success: true, events: data };
  } catch (error) {
    console.error("Error getting past events:", error);
    return { success: false, error };
  }
}

// Get events created by user
export async function getUserEvents(userId: string) {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("created_by", userId)
      .order("date", { ascending: false });

    if (error) throw error;

    return { success: true, events: data };
  } catch (error) {
    console.error("Error getting user events:", error);
    return { success: false, error };
  }
}
