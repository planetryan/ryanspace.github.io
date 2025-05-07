export default {
    async fetch(request, env, ctx) {
      // Access the Clerk Secret API key from the environment variables
      const clerkApiKey = env.CLERK_API_KEY;  // This is the secret key
  
      // Define the Clerk API URL
      const clerkApiUrl = 'https://api.clerk.dev/v1/users';
  
      const usersResponse = await fetch(clerkApiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${clerkApiKey}`,  // Using the secret key for authentication
          'Content-Type': 'application/json'
        }
      });
  
      // Check if the request was successful
      if (!usersResponse.ok) {
        return new Response('Error fetching data from Clerk API', { status: 500 });
      }
  
      // Parse the response to get the data
      const usersData = await usersResponse.json();
  
      // Return the data in the response
      return new Response(
        `Fetched ${usersData.length} users from Clerk API.`,
        { status: 200 }
      );
    },
  };
  