<script lang="ts">
  import { onMount } from "svelte";
  import { supabase } from "$lib/supabase";
  // Current active tab
  let activeTab: "members" | "projects" | "blogs" | "events" = "members";

  // Data from Supabase
  type Member = {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at?: string;
  };
  let members: Member[] = [];
  type Project = {
    id: number;
    title: string;
    status: string;
    lead: string;
    deadline?: string;
  };
  let projects: Project[] = [];
  let blogs = [];
  let events = [];

  // Loading and error states
  let loadingMembers = true;
  let loadingProjects = true;
  let loadingBlogs = true;
  let loadingEvents = true;
  let errorMembers = "";
  let errorProjects = "";
  let errorBlogs = "";
  let errorEvents = "";

  // Fetch data from Supabase on mount
  onMount(async () => {
    // Members
    const { data: membersData, error: membersError } = await supabase
      .from("users")
      .select("*");
    if (membersError) {
      errorMembers = membersError.message;
    } else {
      members = membersData ?? [];
    }
    loadingMembers = false;

    // Projects
    const { data: projectsData, error: projectsError } = await supabase
      .from("projects")
      .select("*");
    if (projectsError) {
      errorProjects = projectsError.message;
    } else {
      projects = projectsData ?? [];
    }
    loadingProjects = false;

    // Blogs
    const { data: blogsData, error: blogsError } = await supabase
      .from("blogs")
      .select("*");
    if (blogsError) {
      errorBlogs = blogsError.message;
    } else {
      blogs = blogsData ?? [];
    }
    loadingBlogs = false;

    // Events
    const { data: eventsData, error: eventsError } = await supabase
      .from("events")
      .select("*");
    if (eventsError) {
      errorEvents = eventsError.message;
    } else {
      events = eventsData ?? [];
    }
    loadingEvents = false;
  });

  // Theme toggle
  let darkMode = false;
  function toggleTheme() {
    darkMode = !darkMode;
  }

  function logout() {
    window.location.href = "/logout";
  }
</script>

<div
  class={`min-h-screen ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"}`}
>
  <!-- Header -->
  <header
    class={`${darkMode ? "bg-gray-800" : "bg-gray-800"} text-white p-4 shadow`}
  >
    <div class="container mx-auto flex justify-between items-center max-w-7xl">
      <div class="flex items-center space-x-2">
        <img
          src="data:image/png;base64,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"
          alt="ML Club Logo"
          class="h-10 w-10"
        />
        <h1 class="text-xl font-bold">ML Club Admin Panel</h1>
      </div>
      <div class="flex items-center space-x-4">
        <button
          on:click={toggleTheme}
          class={`p-2 rounded-full ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-700 hover:bg-gray-600"}`}
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {#if darkMode}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                clip-rule="evenodd"
              />
            </svg>
          {:else}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
              />
            </svg>
          {/if}
        </button>
        <button
          class="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
          on:click={logout}
        >
          Logout
        </button>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="container mx-auto p-4 max-w-7xl">
    <!-- Tab Navigation -->
    <div
      class={`flex border-b ${darkMode ? "border-gray-700" : "border-gray-200"} mb-6`}
    >
      <button
        class={`px-4 py-2 font-medium ${activeTab === "members" ? `${darkMode ? "text-indigo-400 border-b-2 border-indigo-400" : "text-indigo-600 border-b-2 border-indigo-600"}` : `${darkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"}`}`}
        on:click={() => (activeTab = "members")}
      >
        Members
      </button>
      <button
        class={`px-4 py-2 font-medium ${activeTab === "projects" ? `${darkMode ? "text-indigo-400 border-b-2 border-indigo-400" : "text-indigo-600 border-b-2 border-indigo-600"}` : `${darkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"}`}`}
        on:click={() => (activeTab = "projects")}
      >
        Projects
      </button>
      <button
        class={`px-4 py-2 font-medium ${activeTab === "blogs" ? `${darkMode ? "text-indigo-400 border-b-2 border-indigo-400" : "text-indigo-600 border-b-2 border-indigo-600"}` : `${darkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"}`}`}
        on:click={() => (activeTab = "blogs")}
      >
        Blogs
      </button>
      <button
        class={`px-4 py-2 font-medium ${activeTab === "events" ? `${darkMode ? "text-indigo-400 border-b-2 border-indigo-400" : "text-indigo-600 border-b-2 border-indigo-600"}` : `${darkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"}`}`}
        on:click={() => (activeTab = "events")}
      >
        Events
      </button>
    </div>

    <!-- Members Tab -->
    {#if activeTab === "members"}
      <div
        class={`rounded-lg shadow p-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}
      >
        <h2 class="text-xl font-semibold mb-6">Member Management</h2>
        {#if loadingMembers}
          <div>Loading members...</div>
        {:else if errorMembers}
          <div class="text-red-500">{errorMembers}</div>
        {:else}
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class={darkMode ? "bg-gray-700" : "bg-gray-50"}>
                <tr>
                  <th
                    class={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-300" : "text-gray-500"}`}
                    >Name</th
                  >
                  <th
                    class={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-300" : "text-gray-500"}`}
                    >Email</th
                  >
                  <th
                    class={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-300" : "text-gray-500"}`}
                    >Role</th
                  >
                  <th
                    class={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-300" : "text-gray-500"}`}
                    >Joined</th
                  >
                </tr>
              </thead>
              <tbody
                class={`divide-y ${darkMode ? "divide-gray-700 bg-gray-800" : "divide-gray-200 bg-white"}`}
              >
                {#each members as member (member.id)}
                  <tr class={darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}>
                    <td class="px-6 py-4 whitespace-nowrap">{member.name}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{member.email}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{member.role}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{member.created_at?.split("T")[0]}</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        {/if}
      </div>
    {:else if activeTab === "projects"}
      <!-- Projects Tab -->
      <div
        class={`rounded-lg shadow p-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}
      >
        <h2 class="text-xl font-semibold mb-6">Project Management</h2>
        {#if loadingProjects}
          <div>Loading projects...</div>
        {:else if errorProjects}
          <div class="text-red-500">{errorProjects}</div>
        {:else}
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class={darkMode ? "bg-gray-700" : "bg-gray-50"}>
                <tr>
                  <th
                    class={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-300" : "text-gray-500"}`}
                    >Title</th
                  >
                  <th
                    class={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-300" : "text-gray-500"}`}
                    >Status</th
                  >
                  <th
                    class={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-300" : "text-gray-500"}`}
                    >Lead</th
                  >
                  <th
                    class={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-300" : "text-gray-500"}`}
                    >Deadline</th
                  >
                </tr>
              </thead>
              <tbody
                class={`divide-y ${darkMode ? "divide-gray-700 bg-gray-800" : "divide-gray-200 bg-white"}`}
              >
                {#each projects as project (project.id)}
                  <tr class={darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}>
                    <td class="px-6 py-4 whitespace-nowrap">{project.title}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{project.status}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{project.lead}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{project.deadline}</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        {/if}
      </div>
    {:else if activeTab === "blogs"}
      <!-- Blogs Tab -->
      <div
        class={`rounded-lg shadow p-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}
      >
        <h2 class="text-xl font-semibold mb-6">Blog Management</h2>
        {#if loadingBlogs}
          <div>Loading blogs...</div>
        {:else if errorBlogs}
          <div class="text-red-500">{errorBlogs}</div>
        {:else}
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class={darkMode ? "bg-gray-700" : "bg-gray-50"}>
                <tr>
                  <th
                    class={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-300" : "text-gray-500"}`}
                    >Title</th
                  >
                  <th
                    class={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-300" : "text-gray-500"}`}
                    >Author</th
                  >
                  <th
                    class={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-300" : "text-gray-500"}`}
                    >Status</th
                  >
                  <th
                    class={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-300" : "text-gray-500"}`}
                    >Date</th
                  >
                </tr>
              </thead>
              <tbody
                class={`divide-y ${darkMode ? "divide-gray-700 bg-gray-800" : "divide-gray-200 bg-white"}`}
              >
                {#each blogs as blog (blog.id)}
                  <tr class={darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}>
                    <td class="px-6 py-4 whitespace-nowrap">{blog.title}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{blog.author}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{blog.status}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{blog.created_at?.split("T")[0]}</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        {/if}
      </div>
    {:else if activeTab === "events"}
      <!-- Events Tab -->
      <div
        class={`rounded-lg shadow p-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}
      >
        <h2 class="text-xl font-semibold mb-6">Event Management</h2>
        {#if loadingEvents}
          <div>Loading events...</div>
        {:else if errorEvents}
          <div class="text-red-500">{errorEvents}</div>
        {:else}
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class={darkMode ? "bg-gray-700" : "bg-gray-50"}>
                <tr>
                  <th
                    class={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-300" : "text-gray-500"}`}
                    >Title</th
                  >
                  <th
                    class={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-300" : "text-gray-500"}`}
                    >Date</th
                  >
                  <th
                    class={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-300" : "text-gray-500"}`}
                    >Location</th
                  >
                  <th
                    class={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-300" : "text-gray-500"}`}
                    >Attendees</th
                  >
                </tr>
              </thead>
              <tbody
                class={`divide-y ${darkMode ? "divide-gray-700 bg-gray-800" : "divide-gray-200 bg-white"}`}
              >
                {#each events as event (event.id)}
                  <tr class={darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}>
                    <td class="px-6 py-4 whitespace-nowrap">{event.title}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{event.date}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{event.location}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{event.attendees}</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        {/if}
      </div>
    {/if}
  </main>
</div>
