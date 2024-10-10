import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddProduct() {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [costPrice, setCostPrice] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState("");
    const [productImage, setProductImage] = useState("");

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        const newProduct = {
            Name: name,
            Price: price,
            CostPrice: costPrice,
            Description: description,
            Category: category,
            Stock: stock,
            ProductImage: productImage
        };

        fetch("/api/addproduct", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newProduct)
        })
            .then(res => res.json())
            .then(() => {
                // Redirect to the product page after adding
                navigate("/products");
            })
            .catch(err => console.error("Error adding product:", err));
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Add New Product</h2>
            <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} required />
            <input type="number" placeholder="Price" onChange={(e) => setPrice(e.target.value)} required />
            <input type="number" placeholder="Cost Price" onChange={(e) => setCostPrice(e.target.value)} required />
            <textarea placeholder="Description" onChange={(e) => setDescription(e.target.value)} required></textarea>
            <input type="text" placeholder="Category" onChange={(e) => setCategory(e.target.value)} required />
            <input type="number" placeholder="Stock" onChange={(e) => setStock(e.target.value)} required />
            <input type="text" placeholder="Product Image URL" onChange={(e) => setProductImage(e.target.value)} required />
            <button type="submit">Add Product</button>
        </form>
    );
}

export default AddProduct;
