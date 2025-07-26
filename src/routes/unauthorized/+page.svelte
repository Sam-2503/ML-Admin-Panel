<script lang="ts">
  import { goto } from '$app/navigation'
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full space-y-8 text-center">
    <div>
      <h1 class="text-6xl font-bold text-red-600 mb-4">403</h1>
      <h2 class="text-3xl font-extrabold text-gray-900 mb-4">
        Access Denied
      </h2>
      <p class="text-gray-600 mb-8">
        You don't have permission to access this page. Please contact an administrator if you believe this is an error.
      </p>
      
      <div class="space-y-4">
        <button
          on:click={() => goto('/')}
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Go to Dashboard
        </button>
        
        <button
          on:click={() => goto('/login')}
          class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Sign in with Different Account
        </button>
      </div>
    </div>
  </div>
</div> 