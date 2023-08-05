// src/components/LoginForm.tsx

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { Button, TextField } from "@mui/material";
import { makeStyles, ThemeProvider, createTheme } from "@mui/material/styles";
const baseUrl: string = "http://localhost:4000";

const theme = createTheme(); // Create an empty theme

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseUrl}/api/v1/users/login`, {
        email,
        password,
      });

      const actualData = response.data ? response.data : null;

      if (actualData === null) {
        alert("Login failed");
        return;
      }

      sessionStorage.setItem("token", actualData.token);

      dispatch({
        type: "SET_USER",
        payload: {
          user: actualData.user,
        },
      });

      window.location.href = "/product-list";
    } catch (error: any) {
      if (error.response === undefined) {
        alert("Login failed, Server Error");
        return;
      }
      const errorMessage = error.response.data;
      alert(errorMessage.message || "Login failed");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      {" "}
      <h1 style={{ textAlign: "center" }}>
        Login <span role="img">🔐</span>
      </h1>
      <form
        onSubmit={handleLogin}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <TextField
          type="email"
          label="Email"
          variant="outlined"
          sx={{ mb: 2 }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          type="password"
          label="Password"
          variant="outlined"
          sx={{ mb: 2 }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          sx={{ padding: 1.2 }}
        >
          Login
        </Button>
      </form>
    </ThemeProvider>
  );
};

export default LoginForm;
