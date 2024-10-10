import React, { useState, useEffect } from 'react';
import './stock.css';

const Stock = () => {
    const [data, setData] = useState([]);
    const [updateStockId, setUpdateStockId] = useState(null);
    const [costPrice,setcostPrice]=useState({})
    const [newStock, setNewStock] = useState('');

    useEffect(() => {
        fetch("/api/product", { method: "GET" })
            .then(res => res.json())
            .then(res => {
                setData(res);
                const pro={};
                res.forEach(product => {
                    pro[product._id]=product.CostPrice;
                });
                setcostPrice(pro)
                
            });
    }, []);

    const handleUpdateClick = (id) => {
        setUpdateStockId(id);
        setNewStock(''); // Reset new stock input
    };

    const handleStockChange = (e) => {
        setNewStock(e.target.value);
    };

    const handleUpdateSubmit = async (id) => {
        if (newStock.trim() === '') {
            alert('Please enter a new stock level.');
            return;
        }

        try {
            const response = await fetch('/api/addStock', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id, stock: newStock })
            });

            if (response) {
                const date=new Date().toISOString().split('T')[0];
                const expense=newStock*(costPrice[updateStockId])
                await fetch('/api/updateDailyExpens', {
                    method : 'POST',
                    body : JSON.stringify({ Date : date , Expense: parseInt(expense)}),
                    headers : {
                        "Content-Type" : "application/json"
                    }
                })

                setUpdateStockId(null); // Close the input after updating
                setNewStock('');
                // Optionally, you can refetch data or update state
                const updatedData = await fetch("/api/product").then(res => res.json());
               
                setData(updatedData);
            } else {
                alert('Failed to update stock.');
            }
        } catch (error) {
            console.error('Error updating stock:', error);
        }
    };

    return (
        <div className="stock-container">
            <h1>Product Stock</h1>
            <div className="product-grid">
                {data.map((product) => (
                    <div key={product._id} className="product-card">
                        <img src={product.ProductImage} alt={product.Name} className="product-image" />
                        <h2 className="product-name">{product.Name}</h2>
                        <p className="product-description">{product.Description}</p>
                        <p className="product-stock">Stock: {product.Stock}</p>

                        {updateStockId === product._id ? (
                            <div>
                                <input
                                    type="number"
                                    value={newStock}
                                    onChange={handleStockChange}
                                    className="stock-input"
                                    placeholder="Enter new stock"
                                />
                                <button onClick={() => handleUpdateSubmit(product._id)} className="update-button">Update</button>
                            </div>
                        ) : (
                            <button onClick={() => handleUpdateClick(product._id)} className="update-button">Update Stock</button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Stock;
