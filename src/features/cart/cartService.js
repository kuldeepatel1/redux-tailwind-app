import axios from "axios";

const API = "https://app-backend-ruby.vercel.app/api/cart";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getCartApi = async () => {
  const res = await axios.get(API, authHeader());
  return res.data;
};

export const addToCartApi = async ({ productId, quantity }) => {
  const res = await axios.post(
    `${API}/add`,
    { productId, quantity },
    authHeader()
  );
  return res.data;
};

export const updateCartApi = async ({ productId, quantity }) => {
  const res = await axios.put(
    `${API}/update`,
    { productId, quantity },
    authHeader()
  );
  return res.data;
};

export const removeFromCartApi = async (productId) => {
  const res = await axios.delete(`${API}/remove/${productId}`, authHeader());
  return res.data;
};

export const checkoutApi = async () => {
  const res = await axios.post(
    "https://app-backend-ruby.vercel.app/api/orders",
    {},
    authHeader()
  );
  return res.data;
};

