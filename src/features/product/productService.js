
import api from "../../utils/api";

// Fetch all products
export const getProductsApi = async (page = 1) => {
  try {
    const response = await api.get(`/products?page=${page}`);
    // Handle both paginated and direct array responses
    if (response.data.products) {
      return {
        products: response.data.products,
        pagination: response.data.pagination
      };
    }
    return {
      products: response.data,
      pagination: { total: response.data.length, page: 1, pages: 1 }
    };
  } catch (error) {
    throw error;
  }
};

// Fetch product by ID
export const getProductByIdApi = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Add a product
export const addProductApi = async (productData) => {
  try {
    const response = await api.post("/products", productData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update a product
export const updateProductApi = async (id, productData) => {
  try {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete a product
export const deleteProductApi = async (id) => {
  try {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get current user's products
export const getMyProductsApi = async () => {
  try {
    const response = await api.get("/products/user/my-products");
    return response.data;
  } catch (error) {
    throw error;
  }
};
