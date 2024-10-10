import { Link } from 'react-router-dom'
import order from './assets/orederE.png'
import product from './assets/product.webp'
import sale from './assets/sale.png'
import stock from './assets/stock.png'
import  './homec.css'
// import { BrowserRouter, Link, Outlet, Route, Routes } from 'react-router-dom';

import App from '../App'

function Home(){
    
    return (
        <>
        <div className="bgImg">
        <div className="main">
            <Link className="card" style={{width: "18rem"}} to='/CEntry'>
                <img src={order} className="card-img-top" />
                    <div className="card-body">
                        <a href="#" class="btn btn-primary">Order</a>
                    </div>
            </Link>
            <Link className="card" style={{width: "18rem"}} to='/Product'>
                <img src={product} className="card-img-top" />
                    <div className="card-body">
                        <a href="#" class="btn btn-primary">Product</a>
                    </div>
            </Link>
            <Link className="card" style={{width: "18rem"}} tp='/Daily'>
                <img src={sale} className="card-img-top" />
                    <div className="card-body">
                        <a href="#" class="btn btn-primary">Total Sales</a>
                    </div>
            </Link>
            <Link className="card" style={{width: "18rem"}} to='/Stock'>
                <img src={stock} className="card-img-top" />
                    <div className="card-body">
                        <a href="#" class="btn btn-primary">Stock</a>
                    </div>
            </Link>
        </div>
        <div className="quote">
        <h1>"<big style={{color:"lightcoral"}}>Success</big> is not just about profits; </h1><h1>it’s about crafting a legacy of inspiration"</h1>
        </div>
        
        </div>
        </>
       
    );
}

export default Home;