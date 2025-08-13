<script lang="ts">
  import { enhance } from "$app/forms";
  import type { PageData } from "./$types";

  export let data: PageData;

  let events = data.events;
  let showAddEventModal = false;
  let searchTerm = data.search || "";
  let statusFilter = data.statusFilter || "all";
  let categoryFilter = data.categoryFilter || "all";

  let newEvent = {
    title: "",
    description: "",
    date: "",
    time: "",
    duration: "",
    location: "",
    capacity: 50,
    category: "Workshop",
    organizer: "",
    imageUrl: "",
  };

  const categories = [
    "Workshop",
    "Panel Discussion",
    "Hackathon",
    "Guest Lecture",
    "Career Fair",
    "Conference",
    "Networking",
  ];
  const statuses = ["upcoming", "ongoing", "completed", "cancelled"];

  $: filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || event.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || event.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  function addEvent() {
    const event = {
      ...newEvent,
      id: events.length + 1,
      registeredCount: 0,
      status: "upcoming",
    };
    events = [event, ...events];
    showAddEventModal = false;
    newEvent = {
      title: "",
      description: "",
      date: "",
      time: "",
      duration: "",
      location: "",
      capacity: 50,
      category: "Workshop",
      organizer: "",
      imageUrl: "",
    };
  }

  function deleteEvent(eventId: number) {
    events = events.filter((event) => event.id !== eventId);
  }

  function updateEventStatus(eventId: number, newStatus: string) {
    events = events.map((event) =>
      event.id === eventId ? { ...event, status: newStatus } : event
    );
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "ongoing":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  function getCategoryColor(category: string) {
    const colors = {
      Workshop: "bg-purple-100 text-purple-800",
      "Panel Discussion": "bg-indigo-100 text-indigo-800",
      Hackathon: "bg-pink-100 text-pink-800",
      "Guest Lecture": "bg-yellow-100 text-yellow-800",
      "Career Fair": "bg-green-100 text-green-800",
      Conference: "bg-blue-100 text-blue-800",
      Networking: "bg-orange-100 text-orange-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  }
</script>

<div class="max-w-7xl mx-auto p-8 font-sans">
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-2">Event Management</h1>
    <p class="text-gray-600">
      Create, update, and manage events for the ML Club
    </p>
  </div>

  <!-- Header Actions -->
  <div class="flex justify-between items-center mb-8">
    <button
      on:click={() => (showAddEventModal = true)}
      class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
    >
      <svg
        class="w-5 h-5 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        ></path>
      </svg>
      Add New Event
    </button>

    <div class="text-sm text-gray-500">
      Total Events: {events.length}
    </div>
  </div>

  <!-- Filters and Search -->
  <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2"
          >Search Events</label
        >
        <input
          type="text"
          placeholder="Search by title, description, or organizer..."
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          bind:value={searchTerm}
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2"
          >Status Filter</label
        >
        <select
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          bind:value={statusFilter}
        >
          <option value="all">All Statuses</option>
          {#each statuses as status}
            <option value={status}
              >{status.charAt(0).toUpperCase() + status.slice(1)}</option
            >
          {/each}
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2"
          >Category Filter</label
        >
        <select
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          bind:value={categoryFilter}
        >
          <option value="all">All Categories</option>
          {#each categories as category}
            <option value={category}>{category}</option>
          {/each}
        </select>
      </div>
    </div>
  </div>

  <!-- Events Grid -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {#each filteredEvents as event (event.id)}
      <div
        class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
      >
        <div
          class="h-48 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center"
        >
          <div class="text-white text-center">
            <svg
              class="w-16 h-16 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
            <p class="text-lg font-semibold">{event.title}</p>
          </div>
        </div>

        <div class="p-6">
          <div class="flex items-center justify-between mb-3">
            <span
              class="px-3 py-1 rounded-full text-xs font-medium {getStatusColor(
                event.status
              )}"
            >
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </span>
            <span
              class="px-3 py-1 rounded-full text-xs font-medium {getCategoryColor(
                event.category
              )}"
            >
              {event.category}
            </span>
          </div>

          <h3 class="text-xl font-semibold text-gray-800 mb-2">
            {event.title}
          </h3>
          <p class="text-gray-600 text-sm mb-4">{event.description}</p>

          <div class="space-y-2 mb-4">
            <div class="flex items-center text-sm text-gray-500">
              <svg
                class="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>
              {event.date} at {event.time}
            </div>
            <div class="flex items-center text-sm text-gray-500">
              <svg
                class="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              {event.duration}
            </div>
            <div class="flex items-center text-sm text-gray-500">
              <svg
                class="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                ></path>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
              </svg>
              {event.location}
            </div>
            <div class="flex items-center text-sm text-gray-500">
              <svg
                class="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                ></path>
              </svg>
              {event.organizer}
            </div>
          </div>

          <div class="mb-4">
            <div class="flex justify-between text-sm text-gray-600 mb-1">
              <span>Registration: {event.registeredCount}/{event.capacity}</span
              >
              <span
                >{Math.round(
                  (event.registeredCount / event.capacity) * 100
                )}%</span
              >
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-blue-600 h-2 rounded-full"
                style="width: {(event.registeredCount / event.capacity) * 100}%"
              ></div>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <button
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <svg
                class="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                ></path>
              </svg>
              Edit
            </button>

            <div class="flex space-x-2">
              {#if event.status === "upcoming"}
                <button
                  on:click={() => updateEventStatus(event.id, "ongoing")}
                  class="px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                >
                  Start
                </button>
                <button
                  on:click={() => updateEventStatus(event.id, "cancelled")}
                  class="px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                >
                  Cancel
                </button>
              {:else if event.status === "ongoing"}
                <button
                  on:click={() => updateEventStatus(event.id, "completed")}
                  class="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                >
                  Complete
                </button>
              {/if}

              <button
                on:click={() => deleteEvent(event.id)}
                class="px-3 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    {/each}
  </div>

  {#if filteredEvents.length === 0}
    <div class="text-center py-12">
      <svg
        class="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        ></path>
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No events found</h3>
      <p class="mt-1 text-sm text-gray-500">
        Try adjusting your search or filter criteria, or create a new event.
      </p>
    </div>
  {/if}
</div>

<!-- Add Event Modal -->
{#if showAddEventModal}
  <div
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
  >
    <div
      class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"
    >
      <div class="mt-3">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Add New Event</h3>
        <form on:submit|preventDefault={addEvent} class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Title</label
            >
            <input
              type="text"
              bind:value={newEvent.title}
              class="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Description</label
            >
            <textarea
              bind:value={newEvent.description}
              rows="3"
              class="w-full p-2 border border-gray-300 rounded-md"
              required
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Date</label
              >
              <input
                type="date"
                bind:value={newEvent.date}
                class="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Time</label
              >
              <input
                type="time"
                bind:value={newEvent.time}
                class="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Duration</label
              >
              <input
                type="text"
                bind:value={newEvent.duration}
                placeholder="e.g., 2 hours"
                class="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Capacity</label
              >
              <input
                type="number"
                bind:value={newEvent.capacity}
                min="1"
                class="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Location</label
            >
            <input
              type="text"
              bind:value={newEvent.location}
              class="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Category</label
              >
              <select
                bind:value={newEvent.category}
                class="w-full p-2 border border-gray-300 rounded-md"
              >
                {#each categories as category}
                  <option value={category}>{category}</option>
                {/each}
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Organizer</label
              >
              <input
                type="text"
                bind:value={newEvent.organizer}
                class="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              on:click={() => (showAddEventModal = false)}
              class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Event
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
{/if}
