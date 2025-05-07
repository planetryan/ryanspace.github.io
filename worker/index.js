export default {
  async fetch(request, env, ctx) {
    // Access the Clerk public key from the environment variables
    const clerkPubKey = env.CLERK_PUBLISHABLE_KEY;  // Access the key you set in Cloudflare Workers settings

    // Initialize Clerk SDK (client-side SDK does not run on Workers, you would use Clerk's API for server-side tasks)
    const clerk = new Clerk(clerkPubKey);
    
    // For demonstration, we'll return a basic response
    return new Response(`Ola desde RyanSpace, Clerk key is: ${clerkPubKey}`);
  },
};
