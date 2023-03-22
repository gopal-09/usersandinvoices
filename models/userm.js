const mongoose=require('mongoose')
const Schema=mongoose.Schema;
const userSchema=new Schema({
  name:{
    type:String,
    required:true,
    unique:true
  },
  balances:[{
    year:{
        type:String,
        enum: ['2022-23', '2023-24', '2024-25'],
        required:true
    },
    balance:{
         type:Number,
         required:true
    }
  }]
})
module.exports= mongoose.model('user',userSchema);