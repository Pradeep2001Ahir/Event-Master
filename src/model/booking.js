import mongoose from "mongoose";
const Schema = mongoose.Schema;

const bookingSchema = new Schema(
    {
        userId : {type: mongoose.Schema.Types.ObjectId, ref:"users", require: true},
        eventId : {type: mongoose.Schema.Types.ObjectId, ref:"events", require:true},
        numberOfTicket : {type:Number, require:true},
        pricePerTicket : {type:Number, require:true},
    },
    {timestamps : true, typeCast : true}
)

const bookingModel = mongoose.model("booking", bookingSchema);

export default bookingModel;