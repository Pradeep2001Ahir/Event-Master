import mongoose from "mongoose";

const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    name: { type: String, require: true },
  },
  {
    timestamps: true,
    typeCast: true,
  }
);

const categoryModel = mongoose.model("categories", categorySchema);

export default categoryModel;
