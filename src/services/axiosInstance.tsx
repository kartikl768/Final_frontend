import axios from "axios";

let API_BASE = "http://localhost:5109";

// Remove trailing slashes and whitespace
API_BASE = API_BASE.replace(/\/+$|\s+/g, "");

// Ensure it ends with /api
const baseURL = API_BASE.endsWith("/api") ? API_BASE : API_BASE + "/api";

const axiosInstance = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// Attach token to requests
axiosInstance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("rms_token");
  console.log("Axios request interceptor - token:", token ? "present" : "missing");
  console.log("Axios request interceptor - URL:", config.url);
  if (token && config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("Axios response interceptor - success:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.log("Axios response interceptor - error:", error?.response?.status, error?.config?.url);
    if (error?.response?.status === 401) {
      console.log("Axios response interceptor - 401 error, clearing session");
      sessionStorage.removeItem("rms_token");
      sessionStorage.removeItem("rms_user");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;