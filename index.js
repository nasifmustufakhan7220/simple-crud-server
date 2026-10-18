import express from "express";
import cors from "cors";

const app = express();
const port = process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json())


app.listen(port, ()=>{
    console.log(`Simple CRUD is running on ${port} port`);
})