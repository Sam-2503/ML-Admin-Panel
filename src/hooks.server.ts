import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    // Example: Prevent access to '/forbidden' and redirect to '/login'
    if (event.url.pathname === '/dashboard') {
        return Response.redirect('/login', 307);
    }

    return resolve(event);
};