import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getOrdersApi,
  createOrderApi,
  getOrderByIdApi,
} from "./orderService";

// ---------------- FETCH ALL ORDERS ----------------
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, thunkAPI) => {
    try {
      const res = await getOrdersApi();
      return res;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ---------------- CREATE ORDER ----------------
export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (_, thunkAPI) => {
    try {
      const res = await createOrderApi();
      return res;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ---------------- FETCH ORDER BY ID ----------------
export const fetchOrderById = createAsyncThunk(
  "orders/fetchOrderById",
  async (id, thunkAPI) => {
    try {
      return await getOrderByIdApi(id);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ---------------- NORMALIZER ----------------
const normalizeOrder = (order) => ({
  ...order,
  _id: order?._id?.$oid || order?._id,
  buyer: order?.buyer?.$oid || order?.buyer,
  products: (order?.products || []).map((p) => p?.$oid || p),
  createdAt: order?.createdAt?.$date || order?.createdAt,
  updatedAt: order?.updatedAt?.$date || order?.updatedAt,
});

// ---------------- SLICE ----------------
const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
  },

  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ===== FETCH ORDERS =====
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;

        /**
         * ❗ Backend BUG:
         * /orders returns { products: [], pagination }
         * So DO NOT overwrite existing orders with empty array
         */
        const list =
          Array.isArray(action.payload)
            ? action.payload
            : action.payload?.orders
            ? action.payload.orders
            : [];

        if (list.length > 0) {
          state.orders = list.map(normalizeOrder);
        }
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== CREATE ORDER =====
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;

        /**
         * ✅ This is the REAL working response
         * So we push it manually into orders list
         */
        if (action.payload?._id) {
          state.orders.unshift(normalizeOrder(action.payload));
        }
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== FETCH ORDER BY ID =====
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.currentOrder = normalizeOrder(action.payload);
      });
  },
});

export const { clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
