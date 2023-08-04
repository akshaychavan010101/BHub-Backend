const express = require("express");
const cors = require("cors");
import connection from "./config/db";
require("dotenv").config();
import UserRouter from "./routes/users.routes";
import ProductRouter from "./routes/products.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req: any, res: any) => {
  res.send("Hello World");
});

app.use("/api/v1/users", UserRouter);
app.use("/api/v1/products", ProductRouter);

app.listen(process.env.PORT, async () => {
  try {
    await connection;
  } catch (error: any) {
    console.log(error);
  }
  console.log(`Server running on port ${process.env.PORT}`);
});
