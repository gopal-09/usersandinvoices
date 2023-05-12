const express = require('express');
require("dotenv").config()
const mongoose = require('mongoose');

const routes= require('./routes/user');
const app = express();
app.use(express.json());
app.use('/api',routes)
mongoose.connect(process.env.URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});
app.get('/',(req,res)=>{
  res.send("hi nhy");
})
//
app.listen(5000,(req,res)=>{
    console.log('server hitt')
})