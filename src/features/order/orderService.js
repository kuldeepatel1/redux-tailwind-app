import api from "../../utils/api";

// Get all orders
export const getOrdersApi = async () => {
  try {
    const response = await api.get("/orders");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create a new order (checkout)
export const createOrderApi = async () => {
  try {
    const response = await api.post("/orders");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get single order by ID
export const getOrderByIdApi = async (orderId) => {
  try {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
