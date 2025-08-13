<script lang="ts">
	import { onMount } from 'svelte';
	
	interface Blog {
		id: string;
		title: string;
		content: string;
		excerpt: string;
		author: string;
		authorEmail: string;
		status: 'Draft' | 'Pending' | 'Approved' | 'Rejected' | 'Published';
		category: 'Machine Learning' | 'Data Science' | 'AI' | 'Tutorial' | 'Research' | 'News' | 'Other';
		submissionDate: string;
		publishDate?: string;
		tags: string[];
		featuredImage?: string;
		readTime: number; // in minutes
		views: number;
		likes: number;
	}
	
	let blogs: Blog[] = [];
	let showAddModal = false;
	let showEditModal = false;
	let showPreviewModal = false;
	let selectedBlog: Blog | null = null;
	let searchTerm = '';
	let filterStatus = 'All';
	let filterCategory = 'All';
	
	// Dummy data
	const dummyBlogs: Blog[] = [
		{
			id: '1',
			title: 'Introduction to Deep Learning with PyTorch',
			content: `# Introduction to Deep Learning with PyTorch

Deep learning has revolutionized the field of artificial intelligence, enabling machines to learn complex patterns from data. PyTorch, developed by Facebook AI Research, has become one of the most popular deep learning frameworks due to its dynamic computational graphs and intuitive Python interface.

## What is Deep Learning?

Deep learning is a subset of machine learning that uses artificial neural networks with multiple layers to model and understand complex patterns in data. These networks can automatically learn representations from data such as images, text, or sound.

## Why PyTorch?

PyTorch offers several advantages:
- **Dynamic Computation Graphs**: Unlike TensorFlow, PyTorch builds graphs dynamically, making debugging easier
- **Python-First**: Seamless integration with Python ecosystem
- **Research-Friendly**: Excellent for prototyping and research
- **Production Ready**: Can be deployed in production environments

## Getting Started

Let's create a simple neural network:

\`\`\`python
import torch
import torch.nn as nn

class SimpleNN(nn.Module):
    def __init__(self, input_size, hidden_size, output_size):
        super(SimpleNN, self).__init__()
        self.layer1 = nn.Linear(input_size, hidden_size)
        self.layer2 = nn.Linear(hidden_size, output_size)
        self.relu = nn.ReLU()
    
    def forward(self, x):
        x = self.layer1(x)
        x = self.relu(x)
        x = self.layer2(x)
        return x

# Create model
model = SimpleNN(10, 20, 2)
print(model)
\`\`\`

## Training Process

The training process involves:
1. **Forward Pass**: Compute predictions
2. **Loss Calculation**: Measure prediction error
3. **Backward Pass**: Compute gradients
4. **Parameter Update**: Update model weights

## Conclusion

PyTorch provides an excellent foundation for deep learning projects. Its intuitive design makes it accessible to beginners while offering the flexibility needed for advanced research and production applications.

Start your deep learning journey with PyTorch today!`,
			excerpt: 'A comprehensive guide to getting started with deep learning using PyTorch, covering neural networks, training processes, and practical examples.',
			author: 'Dr. Sarah Chen',
			authorEmail: 'sarah.chen@example.com',
			status: 'Approved',
			category: 'Tutorial',
			submissionDate: '2024-01-15',
			publishDate: '2024-01-20',
			tags: ['Deep Learning', 'PyTorch', 'Neural Networks', 'Python'],
			readTime: 8,
			views: 1250,
			likes: 89
		},
		{
			id: '2',
			title: 'The Future of AI in Healthcare: Opportunities and Challenges',
			content: `# The Future of AI in Healthcare: Opportunities and Challenges

Artificial Intelligence is transforming healthcare delivery, from diagnosis to treatment planning and patient care. This article explores the current state and future prospects of AI in healthcare.

## Current Applications

AI is already being used in:
- Medical imaging analysis
- Drug discovery
- Patient data management
- Predictive analytics
- Personalized medicine

## Opportunities

The integration of AI in healthcare offers numerous opportunities:
- Improved diagnostic accuracy
- Reduced healthcare costs
- Enhanced patient outcomes
- Accelerated drug development
- Better resource allocation

## Challenges and Concerns

Despite the potential, several challenges exist:
- Data privacy and security
- Regulatory compliance
- Ethical considerations
- Integration with existing systems
- Training and adoption

## Future Outlook

The future of AI in healthcare looks promising, with continued advancements in machine learning algorithms and increased adoption across the industry.`,
			excerpt: 'Exploring the transformative potential of AI in healthcare, examining current applications, opportunities, and the challenges that need to be addressed.',
			author: 'Dr. Michael Rodriguez',
			authorEmail: 'michael.rodriguez@example.com',
			status: 'Pending',
			category: 'Research',
			submissionDate: '2024-02-10',
			tags: ['AI', 'Healthcare', 'Medical Technology', 'Research'],
			readTime: 6,
			views: 0,
			likes: 0
		},
		{
			id: '3',
			title: 'Building a Recommendation System from Scratch',
			content: `# Building a Recommendation System from Scratch

Recommendation systems are everywhere - from Netflix suggesting movies to Amazon recommending products. Let's build one from scratch using collaborative filtering.

## Types of Recommendation Systems

1. **Collaborative Filtering**: Based on user behavior
2. **Content-Based**: Based on item features
3. **Hybrid**: Combining multiple approaches

## Implementation

Here's a simple collaborative filtering system:

\`\`\`python
import numpy as np
from scipy.spatial.distance import cosine

def collaborative_filtering(user_ratings, n_recommendations=5):
    # Calculate user similarity
    similarities = []
    for i in range(len(user_ratings)):
        for j in range(i+1, len(user_ratings)):
            sim = 1 - cosine(user_ratings[i], user_ratings[j])
            similarities.append((i, j, sim))
    
    # Sort by similarity
    similarities.sort(key=lambda x: x[2], reverse=True)
    
    return similarities[:n_recommendations]
\`\`\`

## Evaluation Metrics

Common metrics include:
- Precision and Recall
- Mean Absolute Error (MAE)
- Root Mean Square Error (RMSE)

## Conclusion

Building recommendation systems helps understand the underlying algorithms and challenges in the field.`,
			excerpt: 'Learn how to build a recommendation system from scratch using collaborative filtering techniques and Python.',
			author: 'Alex Johnson',
			authorEmail: 'alex.johnson@example.com',
			status: 'Draft',
			category: 'Tutorial',
			submissionDate: '2024-02-15',
			tags: ['Recommendation Systems', 'Machine Learning', 'Python', 'Collaborative Filtering'],
			readTime: 10,
			views: 0,
			likes: 0
		}
	];
	
	onMount(() => {
		blogs = [...dummyBlogs];
	});
	
	function addBlog(event: Event) {
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);
		
		const tags = formData.get('tags') as string;
		const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
		
		const newBlog: Blog = {
			id: Date.now().toString(),
			title: formData.get('title') as string,
			content: formData.get('content') as string,
			excerpt: formData.get('excerpt') as string,
			author: formData.get('author') as string,
			authorEmail: formData.get('authorEmail') as string,
			status: formData.get('status') as 'Draft' | 'Pending' | 'Approved' | 'Rejected' | 'Published',
			category: formData.get('category') as 'Machine Learning' | 'Data Science' | 'AI' | 'Tutorial' | 'Research' | 'News' | 'Other',
			submissionDate: formData.get('submissionDate') as string,
			tags: tagsArray,
			readTime: parseInt(formData.get('readTime') as string) || 5,
			views: 0,
			likes: 0
		};
		
		blogs = [newBlog, ...blogs];
		showAddModal = false;
		form.reset();
	}
	
	function editBlog(blog: Blog) {
		selectedBlog = { ...blog };
		showEditModal = true;
	}
	
	function previewBlog(blog: Blog) {
		selectedBlog = blog;
		showPreviewModal = true;
	}
	
	function updateBlog(event: Event) {
		event.preventDefault();
		if (!selectedBlog) return;
		
		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);
		
		const tags = formData.get('tags') as string;
		const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
		
		const updatedBlog: Blog = {
			...selectedBlog,
			title: formData.get('title') as string,
			content: formData.get('content') as string,
			excerpt: formData.get('excerpt') as string,
			author: formData.get('author') as string,
			authorEmail: formData.get('authorEmail') as string,
			status: formData.get('status') as 'Draft' | 'Pending' | 'Approved' | 'Rejected' | 'Published',
			category: formData.get('category') as 'Machine Learning' | 'Data Science' | 'AI' | 'Tutorial' | 'Research' | 'News' | 'Other',
			submissionDate: formData.get('submissionDate') as string,
			tags: tagsArray,
			readTime: parseInt(formData.get('readTime') as string) || 5
		};
		
		blogs = blogs.map(b => b.id === updatedBlog.id ? updatedBlog : b);
		showEditModal = false;
		selectedBlog = null;
	}
	
	function deleteBlog(id: string) {
		if (confirm('Are you sure you want to delete this blog?')) {
			blogs = blogs.filter(b => b.id !== id);
		}
	}
	
	function updateBlogStatus(id: string, newStatus: Blog['status']) {
		blogs = blogs.map(b => {
			if (b.id === id) {
				const updated = { ...b, status: newStatus };
				if (newStatus === 'Published' && !b.publishDate) {
					updated.publishDate = new Date().toISOString().split('T')[0];
				}
				return updated;
			}
			return b;
		});
	}
	
	function getFilteredBlogs() {
		let filtered = blogs.filter(blog => 
			blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			blog.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
			blog.content.toLowerCase().includes(searchTerm.toLowerCase())
		);
		
		if (filterStatus !== 'All') {
			filtered = filtered.filter(blog => blog.status === filterStatus);
		}
		
		if (filterCategory !== 'All') {
			filtered = filtered.filter(blog => blog.category === filterCategory);
		}
		
		return filtered;
	}
	
	function getStatusColor(status: Blog['status']) {
		switch (status) {
			case 'Draft': return 'bg-gray-100 text-gray-800';
			case 'Pending': return 'bg-yellow-100 text-yellow-800';
			case 'Approved': return 'bg-green-100 text-green-800';
			case 'Rejected': return 'bg-red-100 text-red-800';
			case 'Published': return 'bg-blue-100 text-blue-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	}
	
	function getCategoryColor(category: Blog['category']) {
		switch (category) {
			case 'Machine Learning': return 'bg-blue-100 text-blue-800';
			case 'Data Science': return 'bg-green-100 text-green-800';
			case 'AI': return 'bg-purple-100 text-purple-800';
			case 'Tutorial': return 'bg-orange-100 text-orange-800';
			case 'Research': return 'bg-indigo-100 text-indigo-800';
			case 'News': return 'bg-pink-100 text-pink-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	}
	
	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex justify-between items-center">
		<div>
			<h1 class="text-3xl font-bold text-gray-900">Blogs Management</h1>
			<p class="text-gray-600 mt-2">Review, approve, or reject blogs submitted by members</p>
		</div>
		<button
			onclick={() => showAddModal = true}
			class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
			</svg>
			<span>Add Blog</span>
		</button>
	</div>
	
	<!-- Search and Filters -->
	<div class="flex flex-col sm:flex-row gap-4">
		<div class="flex-1">
			<input
				type="text"
				placeholder="Search blogs..."
				bind:value={searchTerm}
				class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
			/>
		</div>
		<select
			bind:value={filterStatus}
			class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
		>
			<option value="All">All Status</option>
			<option value="Draft">Draft</option>
			<option value="Pending">Pending</option>
			<option value="Approved">Approved</option>
			<option value="Rejected">Rejected</option>
			<option value="Published">Published</option>
		</select>
		<select
			bind:value={filterCategory}
			class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
		>
			<option value="All">All Categories</option>
			<option value="Machine Learning">Machine Learning</option>
			<option value="Data Science">Data Science</option>
			<option value="AI">AI</option>
			<option value="Tutorial">Tutorial</option>
			<option value="Research">Research</option>
			<option value="News">News</option>
			<option value="Other">Other</option>
		</select>
	</div>
	
	<!-- Blogs Grid -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		{#each getFilteredBlogs() as blog}
			<div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
				<div class="w-full h-48 bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
					<svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
					</svg>
				</div>
				
				<div class="p-6">
					<div class="flex items-center justify-between mb-2">
						<span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full {getStatusColor(blog.status)}">
							{blog.status}
						</span>
						<span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full {getCategoryColor(blog.category)}">
							{blog.category}
						</span>
					</div>
					
					<h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{blog.title}</h3>
					<p class="text-gray-600 text-sm mb-4 line-clamp-3">{blog.excerpt}</p>
					
					<div class="mb-4">
						<p class="text-sm text-gray-500 mb-1">By: {blog.author}</p>
						<p class="text-xs text-gray-400">Submitted: {formatDate(blog.submissionDate)}</p>
						{#if blog.publishDate}
							<p class="text-xs text-gray-400">Published: {formatDate(blog.publishDate)}</p>
						{/if}
					</div>
					
					<div class="mb-4">
						<div class="flex flex-wrap gap-1">
							{#each blog.tags.slice(0, 3) as tag}
								<span class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">{tag}</span>
							{/each}
							{#if blog.tags.length > 3}
								<span class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">+{blog.tags.length - 3}</span>
							{/if}
						</div>
					</div>
					
					<div class="flex items-center justify-between text-xs text-gray-500 mb-4">
						<span>📖 {blog.readTime} min read</span>
						{#if blog.status === 'Published'}
							<div class="flex items-center space-x-2">
								<span>👁️ {blog.views}</span>
								<span>❤️ {blog.likes}</span>
							</div>
						{/if}
					</div>
					
					<div class="flex space-x-2">
						<button
							onclick={() => previewBlog(blog)}
							class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm"
						>
							Preview
						</button>
						<button
							onclick={() => editBlog(blog)}
							class="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm"
						>
							Edit
						</button>
						<button
							onclick={() => deleteBlog(blog.id)}
							class="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm"
						>
							Delete
						</button>
					</div>
					
					<!-- Quick Status Update -->
					<div class="mt-3 pt-3 border-t border-gray-200">
						<select
							value={blog.status}
							onchange={(e) => updateBlogStatus(blog.id, e.target.value as Blog['status'])}
							class="w-full text-xs border border-gray-300 rounded px-2 py-1"
						>
							<option value="Draft">Draft</option>
							<option value="Pending">Pending</option>
							<option value="Approved">Approved</option>
							<option value="Rejected">Rejected</option>
							<option value="Published">Published</option>
						</select>
					</div>
				</div>
			</div>
		{/each}
	</div>
	
	<!-- Add Blog Modal -->
	{#if showAddModal}
		<div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
			<div class="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
				<div class="mt-3">
					<h3 class="text-lg font-medium text-gray-900 mb-4">Add New Blog</h3>
					<form on:submit={addBlog} class="space-y-4">
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label class="block text-sm font-medium text-gray-700">Title</label>
								<input type="text" name="title" required class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700">Category</label>
								<select name="category" required class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
									<option value="Machine Learning">Machine Learning</option>
									<option value="Data Science">Data Science</option>
									<option value="AI">AI</option>
									<option value="Tutorial">Tutorial</option>
									<option value="Research">Research</option>
									<option value="News">News</option>
									<option value="Other">Other</option>
								</select>
							</div>
						</div>
						
						<div>
							<label class="block text-sm font-medium text-gray-700">Excerpt</label>
							<textarea name="excerpt" rows="3" placeholder="Brief summary of the blog post..." required class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"></textarea>
						</div>
						
						<div>
							<label class="block text-sm font-medium text-gray-700">Content (Markdown)</label>
							<textarea name="content" rows="12" placeholder="Write your blog content in Markdown format..." required class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"></textarea>
						</div>
						
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label class="block text-sm font-medium text-gray-700">Author Name</label>
								<input type="text" name="author" required class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700">Author Email</label>
								<input type="email" name="authorEmail" required class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
							</div>
						</div>
						
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label class="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
								<input type="text" name="tags" placeholder="AI, Machine Learning, Tutorial" required class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700">Read Time (minutes)</label>
								<input type="number" name="readTime" min="1" max="60" value="5" required class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
							</div>
						</div>
						
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label class="block text-sm font-medium text-gray-700">Submission Date</label>
								<input type="date" name="submissionDate" required class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700">Status</label>
								<select name="status" required class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
									<option value="Draft">Draft</option>
									<option value="Pending">Pending</option>
									<option value="Approved">Approved</option>
									<option value="Rejected">Rejected</option>
									<option value="Published">Published</option>
								</select>
							</div>
						</div>
						
						<div class="flex justify-end space-x-3 pt-4">
							<button
								type="button"
								onclick={() => showAddModal = false}
								class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
							>
								Cancel
							</button>
							<button
								type="submit"
								class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
							>
								Add Blog
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	{/if}
	
	<!-- Edit Blog Modal -->
	{#if showEditModal && selectedBlog}
		<div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
			<div class="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
				<div class="mt-3">
					<h3 class="text-lg font-medium text-gray-900 mb-4">Edit Blog</h3>
					<form on:submit={updateBlog} class="space-y-4">
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label class="block text-sm font-medium text-gray-700">Title</label>
								<input type="text" name="title" value={selectedBlog.title} required class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700">Category</label>
								<select name="category" value={selectedBlog.category} required class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
									<option value="Machine Learning">Machine Learning</option>
									<option value="Data Science">Data Science</option>
									<option value="AI">AI</option>
									<option value="Tutorial">Tutorial</option>
									<option value="Research">Research</option>
									<option value="News">News</option>
									<option value="Other">Other</option>
								</select>
							</div>
						</div>
						
						<div>
							<label class="block text-sm font-medium text-gray-700">Excerpt</label>
							<textarea name="excerpt" rows="3" placeholder="Brief summary of the blog post..." required class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">{selectedBlog.excerpt}</textarea>
						</div>
						
						<div>
							<label class="block text-sm font-medium text-gray-700">Content (Markdown)</label>
							<textarea name="content" rows="12" placeholder="Write your blog content in Markdown format..." required class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 font-mono text-sm">{selectedBlog.content}</textarea>
						</div>
						
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label class="block text-sm font-medium text-gray-700">Author Name</label>
								<input type="text" name="author" value={selectedBlog.author} required class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700">Author Email</label>
								<input type="email" name="authorEmail" value={selectedBlog.authorEmail} required class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
							</div>
						</div>
						
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label class="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
								<input type="text" name="tags" value={selectedBlog.tags.join(', ')} placeholder="AI, Machine Learning, Tutorial" required class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700">Read Time (minutes)</label>
								<input type="number" name="readTime" min="1" max="60" value={selectedBlog.readTime} required class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
							</div>
						</div>
						
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label class="block text-sm font-medium text-gray-700">Submission Date</label>
								<input type="date" name="submissionDate" value={selectedBlog.submissionDate} required class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700">Status</label>
								<select name="status" value={selectedBlog.status} required class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
									<option value="Draft">Draft</option>
									<option value="Pending">Pending</option>
									<option value="Approved">Approved</option>
									<option value="Rejected">Rejected</option>
									<option value="Published">Published</option>
								</select>
							</div>
						</div>
						
						<div class="flex justify-end space-x-3 pt-4">
							<button
								type="button"
								onclick={() => { showEditModal = false; selectedBlog = null; }}
								class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
							>
								Cancel
							</button>
							<button
								type="submit"
								class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
							>
								Update Blog
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	{/if}
	
	<!-- Preview Blog Modal -->
	{#if showPreviewModal && selectedBlog}
		<div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
			<div class="relative top-10 mx-auto p-5 border w-full max-w-6xl shadow-lg rounded-md bg-white">
				<div class="mt-3">
					<div class="flex justify-between items-start mb-6">
						<div>
							<h3 class="text-3xl font-bold text-gray-900 mb-2">{selectedBlog.title}</h3>
							<div class="flex items-center space-x-4 text-sm text-gray-600">
								<span>By {selectedBlog.author}</span>
								<span>•</span>
								<span>{formatDate(selectedBlog.submissionDate)}</span>
								<span>•</span>
								<span>{selectedBlog.readTime} min read</span>
								<span>•</span>
								<span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full {getStatusColor(selectedBlog.status)}">
									{selectedBlog.status}
								</span>
							</div>
						</div>
						<button
							onclick={() => { showPreviewModal = false; selectedBlog = null; }}
							class="text-gray-400 hover:text-gray-600"
						>
							<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
							</svg>
						</button>
					</div>
					
					<div class="prose prose-lg max-w-none">
						<div class="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-6 rounded-lg">
							{selectedBlog.content}
						</div>
					</div>
					
					<div class="mt-6 pt-6 border-t border-gray-200">
						<div class="flex items-center justify-between">
							<div class="flex items-center space-x-2">
								<span class="text-sm font-medium text-gray-700">Tags:</span>
								<div class="flex flex-wrap gap-2">
									{#each selectedBlog.tags as tag}
										<span class="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">{tag}</span>
									{/each}
								</div>
							</div>
							<div class="flex space-x-3">
								<button
									onclick={() => { showPreviewModal = false; editBlog(selectedBlog); }}
									class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
								>
									Edit Blog
								</button>
								<button
									onclick={() => { showPreviewModal = false; deleteBlog(selectedBlog.id); }}
									class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
								>
									Delete Blog
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
