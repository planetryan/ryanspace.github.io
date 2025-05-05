// Initialize the Auth0 WebAuth client
const auth0Client = new auth0.WebAuth({
    domain: "auth.ryanspace.cat", // Your Auth0 domain
    clientID: "d5BMj4LU98sAvvgQwgIHiDJfVSyha3VC", // Your Auth0 Client ID
    redirectUri: "https://ryanspace.cat/admin/", // Redirect URI after login
    responseType: "token id_token", // Receive access and ID tokens
    scope: "openid profile email" // Request user info scopes
  });
  
  // DOM Elements
  const loginButton = document.getElementById("login-btn");
  const logoutButton = document.getElementById("logout-btn");
  const userInfoDiv = document.getElementById("user-info");
  
  // Function to initiate login
  function login() {
    console.log("Login button clicked");
    auth0Client.authorize();
  }
  
  // Function to logout and clear session
  function logout() {
    console.log("Logout button clicked");
    auth0Client.logout({
      returnTo: "https://ryanspace.cat/admin/",
      clientID: "d5BMj4LU98sAvvgQwgIHiDJfVSyha3VC"
    });
    clearSession();
  }
  
  // Handle Auth0 redirect after login
  function handleAuthentication() {
    console.log("Handling authentication...");
    auth0Client.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        console.log("Authentication successful:", authResult);
        window.location.hash = "";
        setSession(authResult);
        displayUserInfo();
      } else if (err) {
        console.error("Authentication error:", err);
        alert("Authentication failed. Please try again.");
      }
    });
  }
  
  // Store session data in sessionStorage
  function setSession(authResult) {
    console.log("Setting session...");
    sessionStorage.setItem("access_token", authResult.accessToken);
    sessionStorage.setItem("id_token", authResult.idToken);
    sessionStorage.setItem(
      "expires_at",
      JSON.stringify(authResult.expiresIn * 1000 + new Date().getTime())
    );
  }
  
  // Clear session and UI state
  function clearSession() {
    console.log("Clearing session...");
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("id_token");
    sessionStorage.removeItem("expires_at");
    userInfoDiv.innerHTML = "";
    loginButton.style.display = "inline";
    logoutButton.style.display = "none";
  }
  
  // Check if session is still valid
  function isAuthenticated() {
    const expiresAt = JSON.parse(sessionStorage.getItem("expires_at"));
    return new Date().getTime() < expiresAt;
  }
  
  // Fetch and show user profile info
  function displayUserInfo() {
    const accessToken = sessionStorage.getItem("access_token");
    if (!accessToken) return;
  
    console.log("Fetching user info...");
    userInfoDiv.innerHTML = `<p>Loading user info...</p>`;
  
    auth0Client.client.userInfo(accessToken, (err, user) => {
      if (err) {
        console.error("Error fetching user info:", err);
        userInfoDiv.innerHTML = `<p>Error loading user info. Please try again.</p>`;
        return;
      }
  
      console.log("User info fetched successfully:", user);
      userInfoDiv.innerHTML = `
        <div style="display: flex; align-items: center;">
          <img src="${user.picture}" alt="User Avatar"
               style="width: 50px; height: 50px; border-radius: 50%; margin-right: 10px;">
          <p style="margin: 0;">Welcome, <strong>${user.name}</strong>!</p>
        </div>
      `;
      loginButton.style.display = "none";
      logoutButton.style.display = "inline";
    });
  }
  
  // On page load: handle auth redirect, check session
  window.onload = () => {
    console.log("Page loaded...");
    handleAuthentication();
    if (isAuthenticated()) {
      displayUserInfo();
    }
  };
  
  // Attach event listeners
  loginButton.addEventListener("click", login);
  logoutButton.addEventListener("click", logout);
  