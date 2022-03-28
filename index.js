const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const authRoute = require("./routes/auth-route");
require("./config/passport")

mongoose.connect(process.env.DB_CONNECT,{
  useNewUrlParser: true, //???
  useUnifiedTopology: true, //???
}).then(()=>{
  console.log("connet to mongodb atlas")
}).catch((err)=>{
  console.log(err)
})

//middleware
app.set("view engine","ejs")
app.use(express.json())
app.use(express.urlencoded({extended: true})) // 可取代掉 bodyParser
app.use("/auth", authRoute) 
//每個路由都會經過看是否有/auth 再進入 authRoute
// /auth/login

app.get('/', (req, res)=>{
  res.render("index")
});

app.listen(8080,()=>{
  console.log("server running on port 8080")
})
