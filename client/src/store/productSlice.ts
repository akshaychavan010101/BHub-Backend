import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl: string = "http://localhost:4000";

// Define the type for the product data
export interface Product {
  _id: string;
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

    // Add a new product
    addProductStart(state) {
      state.loading = true;
    },
    addProductSuccess(state, action: PayloadAction<Product>) {
      state.products.push(action.payload);
      state.loading = false;
      state.error = null;
    },
    addProductFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    // Update an existing product
    updateProductStart(state) {
      state.loading = true;
    },
    updateProductSuccess(state, action: PayloadAction<Product>) {
      const updatedProduct = action.payload;
      const index = state.products.findIndex(
        (product) => product._id === updatedProduct._id
      );
      if (index !== -1) {
        state.products[index] = updatedProduct;
      }
      state.loading = false;
      state.error = null;
    },
    updateProductFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

// Export the action creators
export const {
  getProductsStart,
  getProductsSuccess,
  getProductsFailure,
  addProductStart,
  addProductSuccess,
  addProductFailure,
  updateProductStart,
  updateProductSuccess,
  updateProductFailure,
} = productSlice.actions;

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

      if (data && data.data.length === 0) {
        return dispatch(getProductsFailure("No products found"));
      }

      dispatch(getProductsSuccess(data.data));
    } catch (error: any) {
      dispatch(getProductsFailure(error.message));
    }
  };

export const fetchProductsByPage: any =
  (page: number) => async (dispatch: any) => {
    try {
      dispatch(getProductsStart());
      const { data } = await axios.get(
        `${baseUrl}/api/v1/products/paginate/${page}`
      );
      dispatch(getProductsSuccess(data.data));
    } catch (error: any) {
      dispatch(getProductsFailure(error.message));
    }
  };

// Async action to add a new product
export const addProduct: any =
  (addProduct: Product) => async (dispatch: any) => {
    try {
      dispatch(addProductStart());
      const { data } = await axios.post(
        `${baseUrl}/api/v1/products/add`,
        addProduct
      );
      dispatch(addProductSuccess(data.data));
      alert(data.message);
      window.location.href = "/product-list";
    } catch (error: any) {
      dispatch(addProductFailure("Something went wrong"));
      alert("Something went wrong");
    }
  };

// Async action to update an existing product
export const updateProduct: any =
  (updatePro: Product) => async (dispatch: any) => {
    try {
      const body = {
        name: updatePro.name,
        description: updatePro.description,
        price: updatePro.price,
        quantity: updatePro.quantity,
        image: updatePro.image,
      };

      dispatch(updateProductStart());
      const { data } = await axios.patch(
        `${baseUrl}/api/v1/products/edit/${updatePro._id}`,
        body
      );
      dispatch(updateProductSuccess(data.data));
      alert(data.message);
      window.location.href = "/product-list";
    } catch (error: any) {
      dispatch(updateProductFailure("Something went wrong"));
      alert(error.message);
    }
  };
