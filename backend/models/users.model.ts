import mongoose from "mongoose";

const userSchema: any = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const UserModel: any = mongoose.model("User", userSchema);

export default UserModel;
