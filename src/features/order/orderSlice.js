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
      return await getOrdersApi();
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || err.message
      );
    }
  }
);

// ---------------- CREATE ORDER (CHECKOUT) ----------------
export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (_, thunkAPI) => {
    try {
      return await createOrderApi();
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || err.message
      );
    }
  }
);

// ---------------- FETCH SINGLE ORDER ----------------
export const fetchOrderById = createAsyncThunk(
  "orders/fetchOrderById",
  async (id, thunkAPI) => {
    try {
      return await getOrderByIdApi(id);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || err.message
      );
    }
  }
);

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
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = (action.payload || []).map((order) => ({
          ...order,
          products: order.products ?? order.items ?? [],
        }));
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== CREATE ORDER =====
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?._id) {
          state.orders.unshift({
            ...action.payload,
            products: action.payload.products ?? action.payload.items ?? [],
          });
        }
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== FETCH ORDER BY ID =====
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = {
          ...action.payload,
          products: action.payload.products ?? action.payload.items ?? [],
        };
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
