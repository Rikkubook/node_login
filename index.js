const express = require('express');
const passport = require('passport');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const authRoute = require("./routes/auth-route");
const profileRoute = require("./routes/profile-route");
require("./config/passport")

// const cookieSession = require("cookie-session")
const session = require("express-session")
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require("connect-flash")

const store = new MongoDBStore({
  uri: process.env.DB_CONNECT,
  collection: 'mySessions'
});

store.on('error', function(error) {
  console.log(error);
});

mongoose.connect(process.env.DB_CONNECT,{
  useNewUrlParser: true, //解析MongoDB連接字符串
  useUnifiedTopology: true, //改善連接的穩定性和相容性
}).then(()=>{
  console.log('資料庫連線成功')
}).catch((err)=>{
  console.log(err)
})

//middleware
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json())
app.use(express.urlencoded({extended: true})) // 可取代掉 bodyParser


// 設定一個cookies 去記錄狀態
app.use(session({
  secret: process.env.SECRET, // ID cookies
  resave: false, //是否每次請求都重新保存
  saveUninitialized: true, // 是否新的初始化
  store: store,
  cookie: { secure: 'auto', httpOnly: true, maxAge: 86400000 } // 例子配置
}))

app.use(passport.initialize()) //store cookie
app.use(passport.session())

// 再進到新的頁面時可以有跨頁面的訊息
app.use(flash())
app.use((req, res, next)=>{
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
})
app.use("/auth", authRoute) 
app.use("/profile", profileRoute) 
//每個路由都會經過看是否有/auth 再進入 authRoute


app.get('/', (req, res)=>{
  res.render("index",{user: req.user})
});

app.listen(8080,()=>{
  console.log("server running on port 8080")
})

module.exports = app;
