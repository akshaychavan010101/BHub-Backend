import mongoose from "mongoose";

const productsSchema: any = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    index: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    index: true,
  },
  quantity: {
    type: Number,
    required: true,
    index: true,
  },
});

productsSchema.index({ name: "text" });

const ProductModel: any = mongoose.model("Product", productsSchema);

export default ProductModel;
