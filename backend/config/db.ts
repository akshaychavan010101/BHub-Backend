const mongoose = require("mongoose");
require("dotenv").config();

const connection: any = mongoose.connect(process.env.MONGO_URI);

export default connection;
