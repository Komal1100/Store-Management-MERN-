const mongoose=require('mongoose')
const DSalesSchema=new mongoose.Schema({
    Date : {
        type : String
    },
    TotalSale : {
        type : Number,
        default : 0
    },
    TotalProfit : {
        type : Number,
        default : 0
    },
    Expense : {
        type : Number,
        default : 0
    }
})
//export const DailySales=new mongoose.model("DailySales",DSalesSchema)
module.exports=mongoose.model("DailySales",DSalesSchema)
