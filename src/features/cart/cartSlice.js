import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCartApi,
  addToCartApi,
  updateCartApi,
  removeFromCartApi,
} from "./cartService";

// ---------------- FETCH CART ----------------
export const fetchCart = createAsyncThunk(
  "cart/fetch",
  async (_, thunkAPI) => {
    try {
      const data = await getCartApi();

      const rawProducts =
        data?.products ?? data;

      if (Array.isArray(rawProducts)) {
        return rawProducts.map((p) => {
          // already normalized
          if (p.product) {
            return {
              product: p.product,
              quantity: p.quantity ?? 1,
            };
          }

          // backend sends product directly
          return {
            product: p,
            quantity: 1,
          };
        });
      }

      return [];
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || err.message
      );
    }
  }
);

// ---------------- ADD ----------------
export const addToCart = createAsyncThunk(
  "cart/add",
  async ({ productId, quantity }, thunkAPI) => {
    try {
      const data = await addToCartApi({ productId, quantity });
      return data.products;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ---------------- UPDATE ----------------
export const updateQuantity = createAsyncThunk(
  "cart/update",
  async ({ productId, quantity }, thunkAPI) => {
    try {
      const data = await updateCartApi({ productId, quantity });
      return data.products;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ---------------- REMOVE ----------------
export const removeFromCart = createAsyncThunk(
  "cart/remove",
  async (productId, thunkAPI) => {
    try {
      const data = await removeFromCartApi(productId);
      return data.products;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);



const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: false,
    actionLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchCart.pending, (s) => {
        s.loading = true;
      })
      .addCase(fetchCart.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload;
      })
      .addCase(fetchCart.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      // ADD
      .addCase(addToCart.pending, (s) => {
        s.actionLoading = true;
      })
      .addCase(addToCart.fulfilled, (s, a) => {
        s.actionLoading = false;
        s.items = a.payload;
      })

      // UPDATE
      .addCase(updateQuantity.fulfilled, (s, a) => {
        s.items = a.payload;
      })

      // REMOVE
      .addCase(removeFromCart.fulfilled, (s, a) => {
        s.items = a.payload;
      });
  }

});

export default cartSlice.reducer;
