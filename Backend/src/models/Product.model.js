const mongoose=require('mongoose')

const ProductSchema=new mongoose.Schema(
    {
        Name : String,
        Price : Number,
        CostPrice : Number,
        Description : String,
        Category : String,
        Stock : Number,
        ProductImage : String
        // Id : mongoose.Schema.Types.ObjectId
    },{
        collection : 'Products'
    }
)

ProductSchema.virtual('Profit').get(function() {
    return this.Price - this.CostPrice; // Use regular function to access `this`
});

// Ensure virtuals are included in JSON and Object output
ProductSchema.set('toJSON', { virtuals: true });
ProductSchema.set('toObject', { virtuals: true });

module.exports=mongoose.model("Products",ProductSchema)