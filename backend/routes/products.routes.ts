const express = require("express");
import ProductModel from "../models/products.model";
interface ApiResponse<T> {
  status: 0 | 1;
  data: T;
  message: string;
}

interface Product {
  _id: string;
  image: string;
  name: string;
  price: number;
  description: string;
  quantity: number;
}

const ProductRouter = express.Router();

// add product route
ProductRouter.post("/add", async (req: any, res: any) => {
  try {
    const { image, name, price, description, quantity } = req.body;
    const product = new ProductModel({
      image,
      name,
      price,
      description,
      quantity,
    });
    await product.save();
    const response: ApiResponse<null> = {
      status: 1,
      data: null,
      message: "Product added successfully",
    };
    return res.status(201).json(response);
  } catch (error: any) {
    console.log(error);
    const response: ApiResponse<null> = {
      status: 0,
      data: null,
      message: "Error adding product",
    };
    return res.status(500).json(response);
  }
});

// get all products route
ProductRouter.get("/get-all", async (req: any, res: any) => {
  try {
    const products: Product[] = await ProductModel.find();
    const response: ApiResponse<Product[]> = {
      status: 1,
      data: products,
      message: "Products fetched successfully",
    };

    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    const response: ApiResponse<null> = {
      status: 0,
      data: null,
      message: "Error fetching products",
    };
    return res.status(500).json(response);
  }
});

// pagination route
ProductRouter.get("/get-all/:page", async (req: any, res: any) => {
  try {
    const page: number = req.params.page;
    const limit: number = 10;
    const skip: number = (page - 1) * limit;
    const products: Product[] = await ProductModel.find()
      .skip(skip)
      .limit(limit);
    const response: ApiResponse<Product[]> = {
      status: 1,
      data: products,
      message: "Products fetched successfully",
    };

    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    const response: ApiResponse<null> = {
      status: 0,
      data: null,
      message: "Error fetching products",
    };
    return res.status(500).json(response);
  }
});

// search route
ProductRouter.get("/search/:searchTerm", async (req: any, res: any) => {
  try {
    const searchTerm: string = req.params.searchTerm;

    const products: Product[] = await ProductModel.find({
      name: { $regex: searchTerm, $options: "i" },
    });

    const response: ApiResponse<Product[]> = {
      status: 1,
      data: products,
      message: "Products fetched successfully",
    };

    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    const response: ApiResponse<null> = {
      status: 0,
      data: null,
      message: "Error fetching products",
    };
    return res.status(500).json(response);
  }
});

// sort route
ProductRouter.get("/sort/:sortOrder", async (req: any, res: any) => {
  try {
    const sortOrder: string = req.params.sortOrder;
    const products: Product[] = await ProductModel.find().sort({
      price: sortOrder,
    });
    const response: ApiResponse<Product[]> = {
      status: 1,
      data: products,
      message: "Products fetched successfully",
    };

    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    const response: ApiResponse<null> = {
      status: 0,
      data: null,
      message: "Error fetching products",
    };
    return res.status(500).json(response);
  }
});

export default ProductRouter;
