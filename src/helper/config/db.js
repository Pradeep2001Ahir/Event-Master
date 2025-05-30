import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const connect = mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology:true
}).then(()=> console.log("Mongodb connected succesfully!!"))
.catch((error) => console.log("Error in Mongodb connection",error));

export default connect;
