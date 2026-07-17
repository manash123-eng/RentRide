import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// Attach Authorization only for protected endpoints.
// Prevents stale/invalid tokens from breaking public auth/public requests.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("rentride_token");
  const url = config.url || "";

  // Public endpoints
  const isPublic =
    url.startsWith("/auth/register") ||
    url.startsWith("/auth/login") ||
    url.startsWith("/auth/forgot-password") ||
    url.startsWith("/auth/reset-password") ||
    url.startsWith("/vehicles");

  if (token && !isPublic) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("rentride_token");
      localStorage.removeItem("rentride_user");
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
