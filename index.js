const express = require('express');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const postRoute = require('./routes/posts');
const cookieParser = require ('cookie-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const {restrictTo,verify} = require('./controllers/verifyController');

dotenv.config();
const app = express();

//Middleware
app.use(express.json());
app.use(cookieParser());
app.use ((req,res,next)=>{
    // res.header(
    //     "Access-Control-Allow-Headers",
    //     "x-access-token, Origin, Content-Type, Accept"
    // )
    res.setHeader('Access-Control-Allow-Origin','*')
    res.setHeader('Access-Control-Request-Method','*')
    res.setHeader('Access-Control-Allow-Headers','*')
    res.setHeader('Access-Control-Allow-Method','*')
    next()
})
app.use(cors())

//Connect to DB
mongoose.connect(process.env.DB_CONNECT,{ useNewUrlParser:true },)
.then(()=>console.log('connected'))
.catch((err)=> console.log(err));

//Routes
app.use('/',authRoute);
app.use('/api/user',verify,restrictTo("ADMCB","ADMMB"),userRoute);


app.use('/api/posts',postRoute);

app.listen(3000,()=>console.log('running'));