const express=require('express')
const cors=require('cors')
// const app=express()
// const product=require('./Project.Products.json')
const mongoose=require('mongoose')
const bodyParser=require('body-parser')
const product=require('./src/models/Product.model.js')
const dailySale=require('./src/models/DailySales.js')
const custmer=require('./src/models/Custmer.model.js')

const connectionString="mongodb+srv://23010101084:23010101084@cluster0.c0hfb.mongodb.net/Project"
mongoose.connect(connectionString).then(()=>{
    const app=express()
    app.use(express.json());
    app.use(bodyParser.urlencoded({ extended: true })); 
    app.use(cors());

    //Get All Product
    app.get('/api/product',async (req,res)=>{       
        const ans=await product.find();       
         res.json(ans);       
    })

    //Add Custmor
    // app.post('/api/Entry', async (req, res) => {
    //     try {
    //         const newCustomer = new Custmer(req.body);
    //         await newCustomer.save();
            
    //         res.status(201).json(newCustomer);
    //     } catch (error) {
    //         res.status(400).json({ error: error.message });
    //     }
    // });

    app.post('/api/Entry', async (req, res) => {
        console.log('Received data:', req.body); // Log the incoming request body
        try {
            // Validate input
            const { No, Name, PhoneNo, Order } = req.body;
    
            if (!No || !Name || !PhoneNo || !Array.isArray(Order) || Order.length === 0) {
                return res.status(400).json({ error: 'Missing required fields.' });
            }
    
            const newCustomer = new custmer(req.body);
            await newCustomer.save();
            
            res.status(201).json({
                message: 'Customer added successfully',
                customer: newCustomer
            });
        } catch (error) {
            console.error('Error saving customer:', error); // Log the error for debugging
    
            if (error.name === 'ValidationError') {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: 'Server error. Please try again.' });
        }
    });

    app.post('/api/addproduct' , async (req,res) => {
        const newProduct =  new product(req.body)
        await newProduct.save();
    })
    
    //Update Stock
    app.post('/api/updateStock',async (req,res)=>{
        
        const {order} = req.body;
       
        try{
            for(const a of order){
                const productId=a.Product;
                const quantity=a.Quantity;
                await product.findOneAndUpdate(
                    {_id : productId},
                    {$inc: { Stock: -quantity }}
                ) 
                    
            }
        }catch (error) {
            res.status(500).send({ message: "Error updating stock", error });
        }
    })

    //add Stock
    app.post('/api/addStock', async (req, res) => {
        const { id, stock } = req.body;
    
        try {
            // Validate input
            if (!id || stock === undefined) {
                return res.status(400).send('Invalid input');
            }
    
            // Find the product by ID
            const Product = await product.findById(id);
            if (!Product) {
                return res.status(404).send('Product not found');
            }
    
            // Update stock
            Product.Stock += parseInt(stock); // Assign new stock level
            await Product.save(); // Save changes to the database
           
            res.status(200).json(); 
        } catch (error) {
            console.error('Error updating stock:', error);
            res.status(500).send('Server error');
        }
    });


    app.post('/api/updateDailySale', async (req, res) => {
        const { Date, TotalSale, TotalProfit } = req.body;
        
        try {
            const existingSale = await dailySale.findOne({ Date });
    
            if (existingSale) {
                existingSale.TotalSale +=  TotalSale; 
                existingSale.TotalProfit +=  TotalProfit; 
                await existingSale.save();
               
            } else {
                const newSale = new dailySale({ Date, TotalSale, TotalProfit });
                await newSale.save();
            }
            
            res.status(200).send('Daily sale updated successfully');
        } catch (error) {
            console.error('Error updating daily sale:', error);
            res.status(500).send('Internal server error');
        }
    });

    app.post('/api/updateDailyExpens', async (req, res) => {
        const { Date,  Expense  } = req.body;
    
        try {
            const existingSale = await dailySale.findOne({ Date });
    
            if (existingSale) {
                existingSale.Expense  += Expense; 
                await existingSale.save();
            } else {
                const newSale = new dailySale({ Date,  Expense });
                await newSale.save();
            }
            console.log("update expense success")
            res.status(200).send('Daily sale updated successfully');
        } catch (error) {
            console.error('Error updating daily sale:', error);
            res.status(500).send('Internal server error');
        }
    });

    app.put('/api/product/:id' , async(req,res)=>{
        const {id}=req.params
        const  updatedData =req.body
        try {
            console.log(updatedData)
            const updatedProduct = await product.findByIdAndUpdate(id, updatedData,{ new: true }); // Update the product and return the new document
            
            if (!updatedProduct) {
                return res.status(404).json({ message: 'Product not found' });
            }
            
            res.json(updatedProduct); // Send the updated product back in the response
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }

    })
    
    
    //fetch custmer data
    app.get('/api/getCustmer',async (req,res)=>{       
        const ans=await custmer.find();       
         res.json(ans);       
    })

    app.get('/api/getDsales',async (req,res)=>{       
        const ans=await dailySale.find();       
         res.json(ans);       
    })

   

   
    

    
    app.listen(3000,()=>{})

})


