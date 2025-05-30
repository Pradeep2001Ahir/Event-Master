//NPM
import http from 'http';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
//DATABASE
import dataBase from './src/helper/config/db.js';
//MODULE ROUTER
import userRouter from './src/api/user/index.js';
import CategoriRouter from './src/api/categories/index.js';
import eventRouter from './src/api/events/index.js'

const app = express();

app.use(express.json({limit:"200mb"}));
app.use(express.urlencoded({limit:"200mb", extended:true}));

const corsOptions = {
    origin:"*",
    Credential:true,
    optionSuccessStatus:200
}


app.use('/assets', express.static('assets')); //  Serve static images

app.use("/user",userRouter);
app.use("/Category",CategoriRouter);
app.use("/event",eventRouter);

const port = process.env.PORT || 5000;

const server = http.createServer(app).listen(port, ()=> {
    console.log("Server is running in the port ===>>", port)
})

app.get("/", (req, res) => {
    res.status(200).send("Server is running");
} )