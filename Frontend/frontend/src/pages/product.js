import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './product.css';
import App from '../App'

function Product() {
    const [data, setData] = useState([]);
    const apiUrl = "/api/product";

    useEffect(() => {
        fetch(apiUrl, { method: "GET" })
            .then(res => res.json())
            .then(res => setData(res))
            .catch(err => console.error("Error fetching data:", err));
    }, []);

    const formdata = data.map((dta) => (
        <div className="card col-3 cardclass" key={dta._id} style={{ width: "18rem" }}>
            <img src={dta.ProductImage} className="img" alt={dta.Name} />
            <div className="card-body">
                <h5 className="card-title">{dta.Name}</h5>
                <p className="card-text">{dta.Description}</p>
                <Link to={`/update/${dta._id}`} state={dta}>
                    <button className="btn btn-warning">Update</button>
                </Link>
            </div>
            <ul className="list-group list-group-flush">
                <li className="list-group-item"><strong>Category:</strong> {dta.Category}</li>
                <li className="list-group-item"><strong>Price:</strong> {dta.Price}</li>
                
            </ul>
        </div>
    ));

    return (
        <>
            <h1 className="heading">Our Products</h1>
            <Link to="/add">
                <button className="btn btn-primary">Add New Product</button>
            </Link>
            <div className="container">
                <div className="row">
                    {formdata}
                </div>
            </div>
        </>
    );
}

export default Product;
