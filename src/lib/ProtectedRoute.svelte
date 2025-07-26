<script lang="ts">
  import { onMount } from 'svelte'
  import { user, loading, initializeAuth } from './auth'
  import { goto } from '$app/navigation'
  
  export let requiredRole: 'member' | 'admin' | 'super_admin' = 'member'
  export let redirectTo: string = '/login'
  
  let mounted = false
  
  onMount(async () => {
    await initializeAuth()
    mounted = true
  })
  
  $: if (mounted && !$loading) {
    if (!$user) {
      goto(redirectTo)
    } else if ($user.role !== requiredRole && !hasRole($user.role, requiredRole)) {
      goto('/unauthorized')
    }
  }
  
  function hasRole(userRole: string, requiredRole: string): boolean {
    const roleHierarchy = {
      'member': 1,
      'admin': 2,
      'super_admin': 3
    }
    
    return roleHierarchy[userRole as keyof typeof roleHierarchy] >= roleHierarchy[requiredRole as keyof typeof roleHierarchy]
  }
</script>

{#if $loading || !mounted}
  <div class="flex items-center justify-center min-h-screen">
    <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
  </div>
{:else if $user && ($user.role === requiredRole || hasRole($user.role, requiredRole))}
  <slot />
{:else}
  <div class="flex items-center justify-center min-h-screen">
    <div class="text-center">
      <h1 class="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
      <p class="text-gray-600">You don't have permission to access this page.</p>
    </div>
  </div>
{/if}