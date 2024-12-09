import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Product, ProductsState } from "../type";

// Начальное состояние
const initialState: ProductsState = {
  items: [],
  status: "idle",
  showFavorites: false,
  totalCount: 0, // Добавляем свойство для хранения общего количества продуктов
};

// Асинхронное действие для получения продуктов
export const fetchProducts = createAsyncThunk<
  { products: Product[]; totalCount: number },
  { page: number; limit: number }
>("products/fetchProducts", async ({ page, limit }) => {
  const response = await axios.get(
    `https://67537dc8f3754fcea7bbd6ea.mockapi.io/burger?page=${page}&limit=${limit}`
  );
  return {
    products: response.data,
    totalCount: response.headers["x-total-count"], // Предполагаем, что общее количество продуктов возвращается в заголовке
  };
});

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    toggleLike: (state, action: PayloadAction<number>) => {
      const product = state.items.find((item) => item.id === action.payload);
      if (product) {
        product.liked = !product.liked;
      }
    },
    toggleShowFavorites: (state) => {
      state.showFavorites = !state.showFavorites;
    },
    deleteProduct: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(
        (product) => product.id !== action.payload
      );
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.items.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.items = action.payload.products;
        state.totalCount = action.payload.totalCount; // Сохраняем общее количество
        state.status = "succeeded";
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { toggleLike, toggleShowFavorites, deleteProduct, addProduct } =
  productsSlice.actions;
export default productsSlice.reducer;
