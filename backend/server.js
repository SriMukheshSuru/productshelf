import express from 'express';
import dotenv from "dotenv";
import path from "path";
import { connectDB } from './config/db.js';
import productRoutes from "./routes/product.route.js";


dotenv.config();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();
const app = express();

app.use(express.json()); //allows to accept json data 


app.use("/api/products",productRoutes);

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"/frontend/dist")));

    
    app.get(/(.*)/,(req,res) =>{
        res.sendFile(path.resolve(__dirname,"frontend","dist","index.html"));
    });
}


app.listen(PORT,() =>{
    connectDB();
    console.log("server started at http://localhost:"+PORT);
});




// password : WYEdRvyPBR77WRbp