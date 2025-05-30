import mongoose from "mongoose";
import { userRole } from "../helper/common/constant.js";

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    userRole: {
      type: String, default:userRole.user
    },
    profileImage: { type: String, default: "" },
  },
  {
    timestamps: true,
    typeCast: true,
  }
);

const userModel = mongoose.model("users", userSchema);

export default userModel;
