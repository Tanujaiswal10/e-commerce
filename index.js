require("dotenv").config();
const express = require("express");
const connectToDb = require('./config/db')
const app = express();
const port = process.env.DB_PORT;
const route = require('./route/indexRoute')

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//database
connectToDb;

//route 
app.use('/api/v1',route)


app.listen(port,()=>{
    console.log(`server running at port ${port}`)
});