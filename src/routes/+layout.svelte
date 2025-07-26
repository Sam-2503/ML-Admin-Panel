<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { user, loading, initializeAuth, signOut } from '$lib/auth';
	import { goto } from '$app/navigation';
	
	let { children } = $props();
	
	onMount(async () => {
		await initializeAuth();
	});
	
	async function handleSignOut() {
		await signOut();
		goto('/login');
	}
</script>

{#if $loading}
	<div class="flex items-center justify-center min-h-screen">
		<div class="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
	</div>
{:else if $user}
	<div class="min-h-screen bg-gray-50">
		<!-- Navigation -->
		<nav class="bg-white shadow-sm border-b border-gray-200">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div class="flex justify-between h-16">
					<div class="flex items-center">
						<h1 class="text-xl font-semibold text-gray-900">ML Club Admin</h1>
					</div>
					
					<div class="flex items-center space-x-4">
						<span class="text-sm text-gray-700">
							Welcome, {$user.email} ({$user.role})
						</span>
						<button
							on:click={handleSignOut}
							class="text-sm text-gray-500 hover:text-gray-700"
						>
							Sign out
						</button>
					</div>
				</div>
				
				<!-- Navigation Links -->
				<div class="flex space-x-8 pb-4">
					<a href="/" class="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium">
						Dashboard
					</a>
					<a href="/members" class="text-gray-500 hover:text-blue-600 px-3 py-2 text-sm font-medium">
						Members
					</a>
					<a href="/projects" class="text-gray-500 hover:text-blue-600 px-3 py-2 text-sm font-medium">
						Projects
					</a>
					<a href="/blogs" class="text-gray-500 hover:text-blue-600 px-3 py-2 text-sm font-medium">
						Blogs
					</a>
					<a href="/events" class="text-gray-500 hover:text-blue-600 px-3 py-2 text-sm font-medium">
						Events
					</a>
				</div>
			</div>
		</nav>
		
		<!-- Main Content -->
		<main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
			{@render children()}
		</main>
	</div>
{:else}
	{@render children()}
{/if}
