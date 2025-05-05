// Initialize the Auth0 client
const auth0 = new auth0.WebAuth({
    domain: "auth.ryanspace.cat", //  Auth0 domain
    clientID: "d5BMj4LU98sAvvgQwgIHiDJfVSyha3VC", // Auth0 Client ID
    redirectUri: "https://ryanspace.cat/admin/callback", // callback URL
    responseType: "token id_token",
    scope: "openid profile email", // Request user profile and email information
  });
  
  // DOM Elements
  const loginButton = document.getElementById("login-btn");
  const logoutButton = document.getElementById("logout-btn");
  const userInfoDiv = document.getElementById("user-info");
  
  // Function to handle login
  function login() {
    auth0.authorize();
  }
  
  // Function to handle logout
  function logout() {
    auth0.logout({
      returnTo: "https://ryanspace.cat/admin/", 
      clientID: "d5BMj4LU98sAvvgQwgIHiDJfVSyha3VC", // Required for Auth0 logout
    });
    clearSession(); 
  }
  
  // Function to handle authentication once the user is redirected back
  function handleAuthentication() {
    auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = ""; // Clear the URL hash
        setSession(authResult); // Save the session data
        displayUserInfo(); // Fetch and display user info
      } else if (err) {
        console.error("Authentication error:", err);
      }
    });
  }
  
  // Function to save session data in localStorage
  function setSession(authResult) {
    localStorage.setItem("access_token", authResult.accessToken);
    localStorage.setItem("id_token", authResult.idToken);
    localStorage.setItem(
      "expires_at",
      JSON.stringify(authResult.expiresIn * 1000 + new Date().getTime())
    );
  }
  
  // Function to clear session data
  function clearSession() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
    userInfoDiv.innerHTML = ""; // Clear user info display
    loginButton.style.display = "inline";
    logoutButton.style.display = "none";
  }
  
  // Function to check if the user is authenticated
  function isAuthenticated() {
    const expiresAt = JSON.parse(localStorage.getItem("expires_at"));
    return new Date().getTime() < expiresAt; // Check if the current time is before the expiration time
  }
  
  // Function to fetch and display user info
  function displayUserInfo() {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) return;
  
    auth0.client.userInfo(accessToken, (err, user) => {
      if (err) {
        console.error("Error fetching user info:", err);
        return;
      }
  
      // Display the user's name and profile picture
      userInfoDiv.innerHTML = `
        <p>Welcome, ${user.name}!</p>
        <img src="${user.picture}" alt="User Avatar" style="width: 50px; height: 50px; border-radius: 50%;">
      `;
      loginButton.style.display = "none";
      logoutButton.style.display = "inline";
    });
  }
  
  // On page load, check if returning from Auth0 login and handle session
  window.onload = () => {
    handleAuthentication();
    if (isAuthenticated()) {
      displayUserInfo();
    }
  };