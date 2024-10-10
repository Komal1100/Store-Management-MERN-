// UpdateProduct.js
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function UpdateProduct() {
    const location = useLocation();
    const navigate = useNavigate(); // Use useNavigate instead of useHistory
    const product = location.state;

    const [updatedData, setUpdatedData] = useState(product);

    useEffect(() => {
        if (!product) {
            navigate("/Product"); // Redirect if no product data is found
        }
    }, [product, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const apiUrl = `/api/product/${updatedData._id}`; // Adjust based on your API
       
        fetch(apiUrl, {
            method: "PUT",
            body: JSON.stringify(updatedData),
            headers: {
                "Content-Type": "application/json",
            },
            
        })
            .then(res => {
                if (!res.ok) throw new Error("Update failed");
                return res.json();
            })
            .then(() => {
                navigate("/Product"); // Redirect back to the product list
            })
            .catch(err => console.error("Error updating product:", err));
    };

    return (
        <div className="update-form">
            <h2>Update Product</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input type="text" name="Name" value={updatedData.Name} onChange={handleChange} required />
                </label>
                <label>
                    Description:
                    <textarea name="Description" value={updatedData.Description} onChange={handleChange} required />
                </label>
                <label>
                    Category:
                    <input type="text" name="Category" value={updatedData.Category} onChange={handleChange} required />
                </label>
                <label>
                    Price:
                    <input type="number" name="Price" value={updatedData.Price} onChange={handleChange} required />
                </label>
                <label>
                    Cost Price:
                    <input type="number" name="CostPrice" value={updatedData.CostPrice} onChange={handleChange} required />
                </label>
                
                <label>
                    Product Image URL:
                    <input type="text" name="ProductImage" value={updatedData.ProductImage} onChange={handleChange} />
                </label>
                <button type="submit">Update</button>
            </form>
        </div>
    );
}

export default UpdateProduct;
