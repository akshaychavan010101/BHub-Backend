// src/App.tsx

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux"; // Add the Provider import
import store from "./store"; // Assuming you have the store set up correctly
import LoginForm from "./components/LoginForm";
import ProductList from "./components/ProductList";
import { Container, CssBaseline, Typography } from "@mui/material";

function App() {
  return (
    <Provider store={store}>
      {" "}
      {/* Wrap the entire app with Provider and pass the store */}
      <Router>
        <CssBaseline />
        <Container component="main" maxWidth="sm">
          <Typography variant="h4" align="center" gutterBottom>
            Product Management App
          </Typography>
          <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/product-list" element={<ProductList />} />
          </Routes>
        </Container>
      </Router>
    </Provider>
  );
}

export default App;
