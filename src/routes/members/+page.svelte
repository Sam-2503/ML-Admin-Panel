<script lang="ts">
  import type { PageData } from "./$types";
  import { enhance } from "$app/forms";

  export let data: PageData;

  let members = data.members;
  let search = data.search;

  let formData = {
    name: "",
    email: "",
    role: "viewer" as "admin" | "editor" | "viewer",
  };

  let formError = "";
  let formSuccess = false;

  const roles: ("admin" | "editor" | "viewer")[] = [
    "admin",
    "editor",
    "viewer",
  ];

  function handleSearch(e: Event) {
    const target = e.target as HTMLInputElement;
    const params = new URLSearchParams(window.location.search);
    if (target.value) {
      params.set("search", target.value);
    } else {
      params.delete("search");
    }
    window.location.search = params.toString();
  }
</script>

<div class="max-w-4xl mx-auto p-8 font-sans">
  <h1 class="text-3xl font-bold text-gray-800 mb-8">Member Management</h1>

  <!-- Search Bar -->
  <div class="mb-8">
    <input
      type="text"
      placeholder="Search by name, email or role..."
      class="w-full p-2 border border-gray-300 rounded-md"
      bind:value={search}
      on:input={handleSearch}
    />
  </div>

  <!-- Add Member Form -->
  <div class="bg-gray-50 p-6 rounded-lg mb-8">
    <h2 class="text-xl font-semibold text-gray-700 mb-4">Add New Member</h2>
    <form method="POST" action="?/add" use:enhance class="space-y-4">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700 mb-1"
          >Name</label
        >
        <input
          type="text"
          id="name"
          name="name"
          class="w-full p-2 border border-gray-300 rounded-md"
          bind:value={formData.name}
          required
        />
      </div>

      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1"
          >Email</label
        >
        <input
          type="email"
          id="email"
          name="email"
          class="w-full p-2 border border-gray-300 rounded-md"
          bind:value={formData.email}
          required
        />
      </div>

      <div>
        <label for="role" class="block text-sm font-medium text-gray-700 mb-1"
          >Role</label
        >
        <select
          id="role"
          name="role"
          class="w-full p-2 border border-gray-300 rounded-md"
          bind:value={formData.role}
        >
          {#each roles as role}
            <option value={role}>{role}</option>
          {/each}
        </select>
      </div>

      {#if formError}
        <div class="text-red-600 my-2">{formError}</div>
      {/if}

      {#if formSuccess}
        <div class="text-green-600 my-2">Member added successfully!</div>
      {/if}

      <button
        type="submit"
        class="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors"
      >
        Add Member
      </button>
    </form>
  </div>

  <!-- Members Table -->
  <div>
    <h2 class="text-xl font-semibold text-gray-700 mb-4">Members List</h2>
    {#if members.length === 0}
      <p class="text-gray-500">No members found.</p>
    {:else}
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >Name</th
              >
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >Email</th
              >
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >Role</th
              >
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >Actions</th
              >
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {#each members as member (member.id)}
              <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >{member.name}</td
                >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  >{member.email}</td
                >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  >{member.role}</td
                >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <form method="POST" action="?/delete" use:enhance>
                    <input type="hidden" name="id" value={member.id} />
                    <button
                      type="submit"
                      class="text-red-600 hover:text-red-900 transition-colors"
                    >
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
</div>
