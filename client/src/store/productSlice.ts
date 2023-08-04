import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl: string = "http://localhost:4000";

// Define the type for the product data
export interface Product {
  id: number;
  image: string;
  name: string;
  price: number;
  description: string;
  quantity: number;
}

// Define the state for the product slice
export interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

// Define the initial state
const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    getProductsStart(state) {
      state.loading = true;
    },
    getProductsSuccess(state, action: PayloadAction<Product[]>) {
      state.products = action.payload;
      state.loading = false;
      state.error = null;
    },
    getProductsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

// Export the action creators
export const { getProductsStart, getProductsSuccess, getProductsFailure } =
  productSlice.actions;

// Export the reducer
export default productSlice.reducer;

// Async action to fetch products from the backend API
export const fetchProducts: any =
  (serachTerm: string, sortOrder: number) => async (dispatch: any) => {
    try {
      dispatch(getProductsStart());
      if (serachTerm === "" || serachTerm === undefined) {
        serachTerm = "all";
      }

      if (sortOrder === 0 || sortOrder === undefined) {
        sortOrder = 1;
      }

      const { data } = await axios.get(
        `${baseUrl}/api/v1/products/${serachTerm}/${sortOrder}`
      );

      dispatch(getProductsSuccess(data.data));
    } catch (error: any) {
      dispatch(getProductsFailure(error.message));
    }
  };

export const fetchProductsByPage: any =
  (page: number) => async (dispatch: any) => {
    try {
      dispatch(getProductsStart());
      const { data } = await axios.get(`${baseUrl}/api/v1/products/paginate/${page}`);
      dispatch(getProductsSuccess(data.data));
    } catch (error: any) {
      dispatch(getProductsFailure(error.message));
    }
  };
