# ML Club Admin Panel - NIT Silchar

A comprehensive admin panel for managing the Machine Learning Club at NIT Silchar. Built with SvelteKit and Supabase, this application provides role-based access control for managing members, projects, blogs, and events.

## 🚀 Features

### Role-Based Access Control

- **Super Admin**: Full access to all features including user management and invitations
- **Admin**: Can moderate blogs, manage events, and view all projects
- **Member**: Can manage their own profile, projects, and blogs

### Core Functionality

#### For Super Admins

- ✅ Send email invitations to new users
- ✅ Manage user roles (promote/demote users)
- ✅ View and manage all users
- ✅ Full access to all content

#### For Admins

- ✅ Moderate blog posts (approve/reject)
- ✅ Create and manage events
- ✅ View all projects and blogs
- ✅ Delete inappropriate content

#### For Members

- ✅ Complete and update personal profile
- ✅ Create and manage personal projects
- ✅ Write and submit blog posts
- ✅ View club events
- ✅ Track project progress

### Admin Panel Routes

#### 🏠 Dashboard (`/`)

- Overview of all club activities
- Quick access to member, project, blog, and event management
- Dark/light theme toggle
- Real-time statistics and summaries

#### 👥 Members Management (`/members`)

- View all club members with search and filtering
- Add new members with roles (admin, editor, viewer)
- Edit member information and roles
- Delete members
- Responsive table layout with role-based styling

#### 🚀 Projects Management (`/projects`)

- Review member-submitted projects in a modern card layout
- Approve, reject, or mark projects as pending
- View project details including GitHub links and descriptions
- Filter by status (pending, approved, rejected) and category
- Search functionality across titles, authors, and descriptions
- Delete projects with confirmation

#### 📝 Blogs Management (`/blogs`)

- Review member-submitted blog posts with rich metadata
- Approve, reject, or mark blogs as pending
- View blog excerpts, read times, and tags
- Filter by status and category
- Search across titles, authors, and content
- Status summary dashboard with counts
- Delete blogs with confirmation

#### 📅 Events Management (`/events`)

- Create and manage club events with comprehensive forms
- Set event details (date, time, location, capacity, duration)
- Track registration numbers with visual progress bars
- Update event status (upcoming, ongoing, completed, cancelled)
- Filter by status and category
- Search functionality across event details
- Modern card-based layout with event images
- Add new events through modal forms

## 🛠️ Tech Stack

- **Frontend**: SvelteKit with TypeScript
- **Styling**: TailwindCSS
- **Backend**: Supabase
- **Deployment**: Vercel

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Supabase account and project
- Git for version control

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ml-club-admin-panel.git
cd ml-club-admin-panel
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Run the database schema from `database-schema.sql`
4. Get your project URL and anon key from Settings > API

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
PUBLIC_SUPABASE_URL=your_supabase_project_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Set Up the First Super Admin

After running the database schema:

1. Sign up through the application
2. Get your user ID from the Supabase Auth dashboard
3. Update the users table to set your role as 'super_admin':

```sql
UPDATE users
SET role = 'super_admin', profile_completed = true
WHERE email = 'your-email@example.com';
```

### 6. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see the application.

## 📊 Database Schema

The application uses the following main tables:

- **users**: User accounts with roles and authentication
- **profiles**: Extended user information (name, bio, avatar)
- **projects**: User-submitted projects with status tracking
- **blogs**: Blog posts with approval workflow
- **events**: Club events and announcements
- **invitations**: Email invitation system for new users

## 🔐 Authentication & Authorization

### User Roles

1. **Member** (Level 1)

   - Default role for new users
   - Can manage own content only

2. **Admin** (Level 2)

   - Can moderate content
   - Can manage events
   - Can view all user content

3. **Super Admin** (Level 3)
   - Full system access
   - Can manage users and roles
   - Can send invitations

## 🎯 Current Demo State

**Note**: This is currently a UI demonstration with dummy data. The admin panel includes:

- ✅ Complete UI components for all routes
- ✅ Responsive design with Tailwind CSS
- ✅ Interactive forms and modals
- ✅ Search and filtering functionality
- ✅ Status management (approve/reject/update)
- ✅ Modern card and table layouts
- ✅ Server-side route handlers (ready for database integration)

**To connect to a real database**:

1. Update the server files (`+page.server.ts`) to use your database client
2. Replace the dummy data arrays with database queries
3. Update the authentication system in `lib/auth.ts`
4. Configure your environment variables

### Row Level Security (RLS)

The database uses Supabase RLS policies to ensure:

- Users can only modify their own content
- Admins can moderate all content
- Super admins have full access
- Proper data isolation between users

### Adding New Features

1. Create database migrations in Supabase
2. Update TypeScript types in `lib/supabase.ts`
3. Add API functions in appropriate lib files
4. Create/update Svelte components
5. Add proper RLS policies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
