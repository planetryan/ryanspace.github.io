// Initialize the Auth0 client
const auth0 = new auth0.WebAuth({
    domain: "auth.ryanspace.cat", // Auth0 domain
    clientID: "d5BMj4LU98sAvvgQwgIHiDJfVSyha3VC", // Auth0 Client ID
    redirectUri: "https://ryanspace.cat/admin/callback", // Callback URL
    responseType: "token id_token", // Response type
    scope: "openid profile email", // Request user profile and email information
  });
  
  // DOM Elements
  const loginButton = document.getElementById("login-btn");
  const logoutButton = document.getElementById("logout-btn");
  const userInfoDiv = document.getElementById("user-info");
  
  // Function to handle login
  function login() {
    console.log("Login button clicked"); // Debugging statement
    auth0.authorize();
  }
  
  // Function to handle logout
  function logout() {
    console.log("Logout button clicked"); // Debugging statement
    auth0.logout({
      returnTo: "https://ryanspace.cat/admin/", // Redirect after logout
      clientID: "d5BMj4LU98sAvvgQwgIHiDJfVSyha3VC", // Required for Auth0 logout
    });
    clearSession(); // Clear session data
  }
  
  // Function to handle authentication once the user is redirected back
  function handleAuthentication() {
    console.log("Handling authentication..."); // Debugging statement
    auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        console.log("Authentication successful:", authResult); // Debugging statement
        window.location.hash = ""; // Clear the URL hash
        setSession(authResult); // Save the session data
        displayUserInfo(); // Fetch and display user info
      } else if (err) {
        console.error("Authentication error:", err);
        alert("Authentication failed. Please try again.");
      }
    });
  }
  
  // Function to save session data in sessionStorage
  function setSession(authResult) {
    console.log("Setting session..."); // Debugging statement
    sessionStorage.setItem("access_token", authResult.accessToken);
    sessionStorage.setItem("id_token", authResult.idToken);
    sessionStorage.setItem(
      "expires_at",
      JSON.stringify(authResult.expiresIn * 1000 + new Date().getTime())
    );
  }
  
  // Function to clear session data
  function clearSession() {
    console.log("Clearing session..."); // Debugging statement
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("id_token");
    sessionStorage.removeItem("expires_at");
    userInfoDiv.innerHTML = ""; // Clear user info display
    loginButton.style.display = "inline";
    logoutButton.style.display = "none";
  }
  
  // Function to check if the user is authenticated
  function isAuthenticated() {
    const expiresAt = JSON.parse(sessionStorage.getItem("expires_at"));
    return new Date().getTime() < expiresAt; // Check if the current time is before the expiration time
  }
  
  // Function to fetch and display user info
  function displayUserInfo() {
    const accessToken = sessionStorage.getItem("access_token");
    if (!accessToken) return;
  
    // Show loading message while fetching user info
    console.log("Fetching user info..."); // Debugging statement
    userInfoDiv.innerHTML = `<p>Loading user info...</p>`;
  
    auth0.client.userInfo(accessToken, (err, user) => {
      if (err) {
        console.error("Error fetching user info:", err);
        userInfoDiv.innerHTML = `<p>Error loading user info. Please try again.</p>`;
        return;
      }
  
      console.log("User info fetched successfully:", user); // Debugging statement
      // Display the user's name and profile picture
      userInfoDiv.innerHTML = `
        <div style="display: flex; align-items: center;">
          <img src="${user.picture}" alt="User Avatar" style="width: 50px; height: 50px; border-radius: 50%; margin-right: 10px;">
          <p style="margin: 0;">Welcome, <strong>${user.name}</strong>!</p>
        </div>
      `;
      loginButton.style.display = "none";
      logoutButton.style.display = "inline";
    });
  }
  
  // On page load, check if returning from Auth0 login and handle session
  window.onload = () => {
    console.log("Page loaded..."); // Debugging statement
    handleAuthentication(); // Handle authentication if redirected back from Auth0
    if (isAuthenticated()) {
      displayUserInfo(); // Display user info if already authenticated
    }
  };
  
  // Attach event listeners
  loginButton.addEventListener("click", login);
  logoutButton.addEventListener("click", logout);