import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { Product, addProduct, updateProduct } from "../store/productSlice";
import { Typography, TextField, Button } from "@mui/material";
import { useLocation } from "react-router-dom";

interface AddEditProductProps {
  product?: Product; // Product object passed when editing a product
  onCancel: () => void; // Function to handle cancel action
}

const AddEditProduct: React.FC<AddEditProductProps> = ({ onCancel }) => {
  const { loading, error } = useSelector((state: RootState) => state.products);

  const dispatch = useDispatch();
  const location = useLocation();
  const { product } = location.state || {};
  const [name, setName] = useState(product ? product.name : "");
  const [price, setPrice] = useState(product ? product.price.toString() : "");
  const [image, setImage] = useState(product ? product.image.toString() : "");
  const [description, setDescription] = useState(
    product ? product.description : ""
  );
  const [quantity, setQuantity] = useState(
    product ? product.quantity.toString() : ""
  );

  const handleSubmit = () => {
    if (product) {
      // Update existing product
      dispatch(
        updateProduct({
          _id: product._id,
          name,
          price: +price,
          description,
          quantity: +quantity,
          image: image,
        })
      );
    } else {
      // Add new product
      dispatch(
        addProduct({
          name,
          image,
          price: +price,
          description,
          quantity: +quantity,
        })
      );
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h5">
        {product ? "Edit Product" : "Add Product"}
      </Typography>
      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ margin: "10px", width: "300px" }}
      />

      <TextField
        label="Image"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        style={{ margin: "10px", width: "300px" }}
      />

      <TextField
        label="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        style={{ margin: "10px", width: "300px" }}
      />
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ margin: "10px", width: "300px" }}
      />
      <TextField
        label="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        style={{ margin: "10px", width: "300px" }}
      />
      {loading && <Typography>Loading...</Typography>}
      {error && <Typography>{error}</Typography>}
      <Button
        variant="contained"
        color={product ? "primary" : "success"}
        onClick={handleSubmit}
        style={{ margin: "10px" }}
      >
        {product ? "Save Changes" : "Add Product"}
      </Button>
      <Button
        variant="contained"
        color="error"
        onClick={onCancel}
        style={{ margin: "10px" }}
      >
        Cancel
      </Button>
    </div>
  );
};

export default AddEditProduct;
