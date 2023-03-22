const mongoose=require('mongoose')
const Schema=mongoose.Schema;
const invoiceSchema=new Schema({
    date:{
        type:Date,
        required:true,
    },
    customerid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true,
    },
    accountarray:[
        {
            accountid:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'user',
                required:true,
            },
            amount:{
                 //type:Number,
                 type:String,
                 required:true
            }
        }
    ],
    totalamount:{
        type:Number,
        required:true
    },
    invoiceno:{
        type:String,
        required:true
    },
    year:{
       type:String,
       required:true
    }

})
module.exports= mongoose.model('invoice',invoiceSchema);