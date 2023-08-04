const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserRouter = express.Router();
import UserModel from "../models/users.model";
interface ApiResponse<T> {
  status: 0 | 1;
  data: T;
  message: string;
}

interface User {
  _id: string;
  email: string;
  password: string;
}

UserRouter.post("/register", async (req: any, res: any) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      const response: ApiResponse<null> = {
        status: 0,
        data: null,
        message: "Email and password are required",
      };
      return res.status(400).json(response);
    }
    // Hash password
    const hashedPassword: string = await bcrypt.hash(password, 10);
    // Check if user exists already
    const ispresent: User = await UserModel.findOne({ email });

    // If user exists, return error
    if (ispresent) {
      const response: ApiResponse<null> = {
        status: 0,
        data: null,
        message: "User already exists",
      };
      return res.status(400).json(response);
    }

    // Create user, save to database and return success message
    const user = new UserModel({ email: email, password: hashedPassword });
    await user.save();
    const response: ApiResponse<null> = {
      status: 1,
      data: null,
      message: "User registered successfully",
    };

    return res.status(201).json(response);
  } catch (error: any) {
    console.log(error);
    const response: ApiResponse<null> = {
      status: 0,
      data: null,
      message: "Server error",
    };
    return res.status(500).json(response);
  }
});

UserRouter.post("/login", async (req: any, res: any) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      const response: ApiResponse<null> = {
        status: 0,
        data: null,
        message: "Email and password are required",
      };
      return res.status(400).json(response);
    }

    // Check if user exists
    const ispresent: User = await UserModel.findOne({ email });
    if (!ispresent) {
      const response: ApiResponse<null> = {
        status: 0,
        data: null,
        message: "User does not exist",
      };
      return res.status(400).json(response);
    }

    // Check if password is correct
    const user: User = ispresent;
    const isMatch: boolean = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const response: ApiResponse<null> = {
        status: 0,
        data: null,
        message: "Invalid credentials",
      };
      return res.status(400).json(response);
    }

    // Create token, send to client and return success message
    const token: string = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // along with the token, you can send the user details as well
    const response: ApiResponse<any> = {
      status: 1,
      data: {
        token,
        user,
      },
      message: "User logged in successfully",
    };
    return res.status(200).json(response);
  } catch (error: any) {
    console.log(error);
    const response: ApiResponse<null> = {
      status: 0,
      data: null,
      message: "Server error",
    };
    return res.status(500).json(response);
  }
});

export default UserRouter;
