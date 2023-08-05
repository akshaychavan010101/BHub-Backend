import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import {
  fetchProducts,
  fetchProductsByPage,
  Product,
} from "../store/productSlice";
import { Typography } from "@mui/material";
import { Button, TextField } from "@mui/material";
import { useNavigate, useLocation, Routes, Route } from "react-router-dom";
import AddEditProduct from "./AddEditProduct";

const ProductList: React.FC = () => {
  const { products, loading, error } = useSelector(
    (state: RootState) => state.products
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchProductsByPage());
  }, [dispatch]);

  const handleEditProduct = (product: Product) => {
    // Navigate to AddEditProduct component with the product to edit
    navigate("/edit", { state: { product } });
  };

  const handleAddProduct = () => {
    navigate("/add");
  };

  const handleSearch = (searchTerm: string) => {
    dispatch(fetchProducts(searchTerm, 1));
    setCurrentPage(1);
  };

  // debounce handleSearch
  const debounce = (func: any, wait: number) => {
    let timeout: any;
    return function (...args: any) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        timeout = null;
        let st = args[0];
        if (args[0] == "" || args[0].length == 1) {
          st = "";
        }
        func(st);
      }, wait);
    };
  };

  const debounceSearch = debounce(handleSearch, 700);

  const handleSort = (sortOrder: number) => {
    dispatch(fetchProducts("", sortOrder));
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    dispatch(fetchProductsByPage(pageNumber));
  };

  return (
    <div
      style={{
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          height: "35px",
          margin: "10px 0",
        }}
      >
        <input
          type="text"
          placeholder="Search"
          style={{
            width: "50%",
            height: "100%",
            padding: "0 10px",
            borderRadius: "7px",
            outline: "none",
            border: "1px solid black",
          }}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            debounceSearch(searchTerm);
          }}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setSortOrder(-1);
            handleSort(sortOrder);
          }}
        >
          Sort AtoZ
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setSortOrder(1);
            handleSort(sortOrder);
          }}
        >
          Sort ZtoA
        </Button>
      </div>
      <div></div>
      <div>{error && <Typography variant="h6">Error: {error}</Typography>}</div>
      <div>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleAddProduct()}
          style={{ margin: "10px" }}
        >
          Add
        </Button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridGap: "10px",
        }}
      >
        {products.map((product: Product) => (
          <div
            key={product._id}
            style={{
              border: "1px solid black",
              padding: "10px",
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "contain",
              }}
            />
            <Typography variant="h5">{product.name}</Typography>
            <Typography>Price: ${product.price}</Typography>
            <Typography>Description: {product.description}</Typography>
            <Typography>Quantity: {product.quantity}</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleEditProduct(product)}
              style={{ margin: "10px" }}
            >
              Edit
            </Button>
            <Routes>
              <Route
                path="/edit"
                element={
                  <AddEditProduct
                    product={location.state?.product}
                    onCancel={() => navigate("/")}
                  />
                }
              />
              <Route
                path="/add"
                element={<AddEditProduct onCancel={() => navigate("/")} />}
              />
            </Routes>
          </div>
        ))}
      </div>
      <div>
        {Array.from(
          { length: Math.ceil(products.length / 5) },
          (_, index) => index + 1
        ).map((pageNumber) => (
          <Button
            key={pageNumber}
            variant="contained"
            sx={{
              margin: "10px",
            }}
            color={pageNumber === currentPage ? "primary" : "inherit"}
            onClick={() => handlePageChange(pageNumber)}
          >
            {pageNumber}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
