import axios from "axios";

// LIVE backend URL
const API_URL = "https://app-backend-ruby.vercel.app/api/auth";

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
