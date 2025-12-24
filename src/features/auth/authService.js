import axios from "axios";

// LIVE backend URL
const API_URL = "https://app-backend-ruby.vercel.app/api/auth";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// LOGIN
export const loginApi = async (email, password) => {
  const res = await axios.post(`${API_URL}/login`, { email, password });
  return res.data; // { user, token }
};

// REGISTER
export const registerApi = async (name, email, password) => {
  const res = await axios.post(`${API_URL}/register`, { name, email, password });
  return res.data; // { userId, message }
};

// VERIFY OTP
export const verifyOtpApi = async (email, otp) => {
  const res = await axios.post(`${API_URL}/verify-otp`, { email, otp });
  return res.data;
};

// RESEND OTP
export const resendOtpApi = async (email) => {
  const res = await axios.post(`${API_URL}/resend-otp`, { email });
  return res.data;
};

// GET CURRENT USER (localStorage only - no API call)
export const getCurrentUser = async () => {
  // Just get user from localStorage (no API call needed)
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    return { user: JSON.parse(storedUser) };
  }
  throw new Error("No user found in localStorage");
};
