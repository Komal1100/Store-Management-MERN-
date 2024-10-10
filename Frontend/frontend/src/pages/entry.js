// import { useState , useEffect} from "react";
// import './entry.css'


// function Entry(){
//     const [data,setdata]=useState([]);
//     const apiUrl = "/api/product";

//     useEffect(()=>{
//         fetch(apiUrl, {method:"GET"})
//         .then(res=>res.json())
//         .then(res=>setdata(res));
        
//     },[]);
    
//     const option=data.map((dta)=>{
      
//         return(         
//             <option value={dta.Price}>{dta.Name}</option>
//         )
//     });
     
//     const today = new Date();   
//     const year = today.getFullYear();
//     const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-11
//     const day = String(today.getDate()).padStart(2, '0');    
//     const formattedDate = `${year}-${month}-${day}`;  
    
//     const [postData, setPostData]=useState({

//     })
  
   
//     return(
        
//         <>
//             <div className="main">
//                 <div className="custEn">
//                     <h1>Custmer Entry</h1>
//                     <div className="name">
//                         <label htmlFor="iname">Name :</label>
//                         <input type="text" name="name" id="imane" />
//                     </div>
//                     <div className="phoneno">
//                         <label htmlFor="ipno">Phone No :</label>
//                         <input type="Number" name="pno" id="ipno" />
//                     </div>
//                     <div className="date">
//                         <label htmlFor="date">Date</label>
//                         <input type="date" name="date" id="date" />
//                     </div>
//                 </div>

//                 <div className=" container order ">
//                     <div className="row"><h1>Order</h1></div>
//                     <div className="">
//                         <select className="col-7" name="prosel" id="">
//                             {option}
//                         </select>
//                     </div>
//                     <div className="qaun">
//                         <label htmlFor="quan">Quantity :</label>
//                         <input type="number" name="quan" id="quan" />
//                     </div>
//                 </div>

//             </div>
//         </>
//     )
    
// }
// export default Entry
import React, { useState, useEffect } from 'react';
import './entry.css';

const Entry = () => {
    const [data, setData] = useState([]);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [productPrices, setProductPrices] = useState({});
    const [productStock, setProductStock] = useState({});
    const [productProfit, setProductProfit] = useState({});
    const [enoughStock, setEnoughStock] = useState(true);
    const [errors, setErrors] = useState({}); // For storing validation errors

    useEffect(() => {
        fetch("/api/product", { method: "GET" })
            .then(res => res.json())
            .then(res => {
                setData(res);
                const prices = {};
                const stock = {};
                const profit = {};
                res.forEach(product => {
                    stock[product._id] = product.Stock;
                    prices[product._id] = product.Price;
                    profit[product._id] = product.Profit;
                });
                setProductPrices(prices);
                setProductStock(stock);
                setProductProfit(profit);
            });
    }, []);

    const option = data.map((dta) => (
        <option key={dta._id} value={dta._id}>
            {dta.Name}
        </option>
    ));

    const [customer, setCustomer] = useState({
        No: '',
        Name: '',
        Date: date,
        PhoneNo: '',
        Order: [{ Product: '', Quantity: '' }]
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomer((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleOrderChange = (index, e) => {
        const { name, value } = e.target;
        if (name === 'Quantity' && value < 0) return; // Prevent negative quantities
        const orders = [...customer.Order];
        orders[index] = { ...orders[index], [name]: value };
        setCustomer((prev) => ({ ...prev, Order: orders }));
    };

    const addOrder = () => {
        setCustomer((prev) => ({
            ...prev,
            Order: [...prev.Order, { Product: '', Quantity: '' }]
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!customer.No) newErrors.No = "Customer No is required.";
        if (!customer.Name) newErrors.Name = "Customer Name is required.";
        if (!customer.PhoneNo) newErrors.PhoneNo = "Phone Number is required.";
        if (!/^\d+$/.test(customer.PhoneNo)) newErrors.PhoneNo = "Phone Number must be numeric.";
        
        customer.Order.forEach((order, index) => {
            if (!order.Product) {
                newErrors[`Product${index}`] = "Product is required.";
            }
            if (!order.Quantity) {
                newErrors[`Quantity${index}`] = "Quantity is required.";
            }
            if (order.Quantity < 1) {
                newErrors[`Quantity${index}`] = "Quantity must be at least 1.";
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    const calculateTotalBill = () => {
        return customer.Order.reduce((totals, order) => {
            const quantity = parseFloat(order.Quantity) || 0; // Default to 0 if NaN
            const price = productPrices[order.Product] || 0;
            const profit = productProfit[order.Product] || 0;

            const saleAmount = quantity * price;
            const profitAmount = quantity * profit;

            return {
                totalSale: totals.totalSale + saleAmount,
                totalProfit: totals.totalProfit + profitAmount,
            };
        }, { totalSale: 0, totalProfit: 0 });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return; // Only proceed if validation passes

        let stockValid = true;

        for (const order of customer.Order) {
            if (order.Quantity > productStock[order.Product]) {
                stockValid = false;
                break;
            }
        }

        if (!stockValid) {
            setEnoughStock(false);
            return;
        }

        setEnoughStock(true);

        try {
            const response = await fetch('/api/Entry', {
                method: "POST",
                body: JSON.stringify(customer),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            setCustomer({
                No: '',
                Name: '',
                Date: date,
                PhoneNo: '',
                Order: [{ Product: '', Quantity: '' }]
            });

            const data = await response.json();
            const totalSale = calculateTotalBill().totalSale.toFixed(2);
            const totalProfit = calculateTotalBill().totalProfit.toFixed(2);
            const saleDate = customer.Date;

            if (data) {
                await fetch('/api/updateDailySale', {
                    method: 'POST',
                    body: JSON.stringify({ Date: saleDate, TotalSale: parseFloat(totalSale), TotalProfit: parseFloat(totalProfit) }),
                    headers: {
                        "Content-Type": 'application/json'
                    }
                });

                // Update Stock
                await fetch('/api/updateStock', {
                    method: 'POST',
                    body: JSON.stringify({ order: customer.Order }),
                    headers: {
                        "Content-Type": 'application/json'
                    }
                });
            }
        } catch (error) {
            console.error('Error adding customer:', error);
            alert('There was an error submitting the form. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="customer-form">
            <div className="form-group">
                <label htmlFor="customerNo">Customer No</label>
                <input
                    type="number"
                    name="No"
                    id="customerNo"
                    value={customer.No}
                    onChange={handleChange}
                    placeholder="Enter Customer No"
                    required
                />
                {errors.No && <span className="error">{errors.No}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="customerName">Customer Name</label>
                <input
                    type="text"
                    name="Name"
                    id="customerName"
                    value={customer.Name}
                    onChange={handleChange}
                    placeholder="Enter Customer Name"
                    required
                />
                {errors.Name && <span className="error">{errors.Name}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="customerDate">Date</label>
                <input
                    type="date"
                    name="Date"
                    id="customerDate"
                    value={date}
                    onChange={(e) => {
                        setDate(e.target.value);
                        handleChange(e); // Update customer state
                    }}
                />
            </div>

            <div className="form-group">
                <label htmlFor="customerPhone">Phone Number</label>
                <input
                    type="text"
                    name="PhoneNo"
                    id="customerPhone"
                    value={customer.PhoneNo}
                    onChange={handleChange}
                    placeholder="Enter Phone Number"
                    required
                />
                {errors.PhoneNo && <span className="error">{errors.PhoneNo}</span>}
            </div>

            <h3>Orders</h3>
            {customer.Order.map((order, index) => (
                <React.Fragment key={index}>
                    <div className="order-item">
                        <div className="form-group">
                            <label htmlFor={`product-${index}`}>Product</label>
                            <select
                                name="Product"
                                id={`product-${index}`}
                                value={order.Product}
                                onChange={(e) => handleOrderChange(index, e)}
                            >
                                {option}
                            </select>
                            {errors[`Product${index}`] && <span className="error">{errors[`Product${index}`]}</span>}
                        </div>
                        <div className="form-group">
                            <label htmlFor={`quantity-${index}`}>Quantity</label>
                            <input
                                type="number"
                                name="Quantity"
                                id={`quantity-${index}`}
                                value={order.Quantity}
                                onChange={(e) => handleOrderChange(index, e)}
                                placeholder="Enter Quantity"
                                required
                            />
                            {errors[`Quantity${index}`] && <span className="error">{errors[`Quantity${index}`]}</span>}
                        </div>
                        {!enoughStock && (
                            <div className="error-message">
                                Not enough stock available for one or more products. Please check your quantities.
                            </div>
                        )}
                    </div>
                </React.Fragment>
            ))}

            <button type="button" onClick={addOrder} className="add-order-btn">Add Order</button>
            <button type="submit" className="submit-btn">Submit</button>
            <h4>Total Bill: ${calculateTotalBill().totalSale.toFixed(2)}</h4>
        </form>
    );
};

export default Entry;
