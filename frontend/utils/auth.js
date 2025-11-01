export function setupTokenRefresh() {
  // Set up interceptor for 401 responses
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    const response = await originalFetch(...args);

    if (response.status === 401) {
      // Try to refresh the token
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        window.location.href = "/login";
        return response;
      }

      try {
        const refreshRes = await originalFetch(
          "http://localhost:8000/auth/refresh",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
          }
        );

        if (!refreshRes.ok) {
          throw new Error("Refresh failed");
        }

        const data = await refreshRes.json();
        localStorage.setItem("authToken", data.access_token);
        localStorage.setItem("refreshToken", data.refresh_token);

        // Retry the original request with new token
        const request = args[0];
        const config = args[1] || {};

        if (typeof request === "string") {
          return originalFetch(request, {
            ...config,
            headers: {
              ...config.headers,
              Authorization: `Bearer ${data.access_token}`,
            },
          });
        }
      } catch (err) {
        console.error("Token refresh failed:", err);
        // Clear auth state and redirect to login
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
    }

    return response;
  };
}
