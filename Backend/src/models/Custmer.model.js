
// const Product =require('./Product.model')

// const mongoose=require('mongoose')
// const Products=require('./Product.model')

// const OrderSchema = new mongoose.Schema({
//     Product :{
//     type : mongoose.Schema.Types.ObjectId,
//     ref : "Products"},
//     Quantity : Number
// })
// const CustmerSchema=new mongoose.Schema(
//     {
//     No : Number,
//     Name : String,
//     Date : Date,
//     PhoneNo : String,
//     Order : [OrderSchema],
//     bill : Number   
//     },{
//         collection : 'Custmer'
//     }
// )
// module.exports=mongoose.model("Custmer",CustmerSchema)
// export const Custmer=new mongoose.model("Custmer",CustmerSchema)
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    Product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
        // required: true // Ensure product reference is required
    },
    Quantity: {
        type: Number,
        // required: true,
        min: 1 // Quantity must be at least 1
    },
    
});

const CustmerSchema = new mongoose.Schema(
    {
        No: {
            type: Number,
            // required: true,
            index: true // Add index for faster querying
        },
        Name: {
            type: String,
            // required: true // Customer name should be required
        },
        Date: {
            type: String,
            default: Date.now // Default to current date
        },
        PhoneNo: {
            type: String,
            // required: true,
            index: true // Add index for faster querying
        },
        Order: [OrderSchema],
        bill: {
            type: Number,
            default: 0 // Default bill to 0
        }
    },
    {
        collection: 'Custmer'
    }
);

const Custmer = mongoose.model('Custmer', CustmerSchema);
module.exports = Custmer;
