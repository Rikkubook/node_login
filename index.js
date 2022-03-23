const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { urlencoded } = require('express');

dotenv.config();

mongoose.connect("mongodb+srv://rikkubook:rikku0305@cluster0.8pvrz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",{
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

app.get('/', (req, res)=>{
  res.render("index")
});

app.listen(8080,()=>{
  console.log("server running on port 8080")
})
