import mongoose from "mongoose";

const Schema = mongoose.Schema;

const eventSchema = new Schema(
  {
    userId: { type:  mongoose.Schema.Types.ObjectId, ref: "users",require:true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "categories", require:true },
    title: { type: String, require: true },
    description: { type: String, require: true },
    venue: { type: String, require: true },
    capacity: { type: Number, require: true },
    ticketPrice: { type: Number, require: true },
    startDateTime: { type: Date, required: true },
    images: { type: Array , default:[]},
  },
  { timestamps: true, typeCast: true }
);

const eventModel = mongoose.model("events",eventSchema);

export default eventModel;