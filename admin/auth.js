// Initialize the Auth0 client
const auth0 = new auth0.WebAuth({
    domain: "auth.ryanspace.cat",
    clientID: "d5BMj4LU98sAvvgQwgIHiDJfVSyha3VC",
    redirectUri: "https://ryanspace.cat/admin/callback",
    responseType: "token id_token",
    scope: "openid profile email",
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
      clientID: "d5BMj4LU98sAvvgQwgIHiDJfVSyha3VC",
    });
    clearSession();
  }
  
  // Function to handle authentication once the user is redirected back
  function handleAuthentication() {
    auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = "";
        setSession(authResult);
        displayUserInfo();
      } else if (err) {
        console.error("Authentication error:", err);
        alert("Authentication failed. Please try again.");
      }
    });
  }
  
  // Function to save session data in sessionStorage
  function setSession(authResult) {
    sessionStorage.setItem("access_token", authResult.accessToken);
    sessionStorage.setItem("id_token", authResult.idToken);
    sessionStorage.setItem(
      "expires_at",
      JSON.stringify(authResult.expiresIn * 1000 + new Date().getTime())
    );
  }
  
  // Function to clear session data
  function clearSession() {
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("id_token");
    sessionStorage.removeItem("expires_at");
    userInfoDiv.innerHTML = "";
    loginButton.style.display = "inline";
    logoutButton.style.display = "none";
  }
  
  // Function to check if the user is authenticated
  function isAuthenticated() {
    const expiresAt = JSON.parse(sessionStorage.getItem("expires_at"));
    return new Date().getTime() < expiresAt;
  }
  
  // Function to fetch and display user info
  function displayUserInfo() {
    const accessToken = sessionStorage.getItem("access_token");
    if (!accessToken) return;
  
    userInfoDiv.innerHTML = `<p>Loading user info...</p>`;
  
    auth0.client.userInfo(accessToken, (err, user) => {
      if (err) {
        console.error("Error fetching user info:", err);
        userInfoDiv.innerHTML = `<p>Error loading user info. Please try again.</p>`;
        return;
      }
  
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
    handleAuthentication();
    if (isAuthenticated()) {
      displayUserInfo();
    }
  };