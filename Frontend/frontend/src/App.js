import './App.css';
import Home from './pages/home';
import Product from './pages/product';
import Entry from './pages/entry';
import Stock from './pages/stock';
import Daily from './pages/sale';
import UpdateProduct from './pages/updateProduct';
import AddProduct from './pages/addProduct';
import { BrowserRouter, Link, Outlet, Route, Routes } from 'react-router-dom';

function Layout() {
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary rounded" >
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Navbar</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
              <Link className="nav-link active" aria-current="page" to='/Home'>Home</Link>
              <Link className="nav-link" to='/Product'>Products</Link>
              <Link className="nav-link" to='/Daily'>Sale</Link>
              <Link className="nav-link " to='/CEntry'>Entry</Link>
              <Link className="nav-link" to='/Stock'> Stock</Link>
            </div>
          </div>
        </div>
      </nav>
      <Outlet/>
    </>
  )
}
function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout/>}>
          <Route path='/Home' element={<Home/>}/>
          <Route path='/Product' element={<Product/>}/>
          <Route path='/CEntry' element={<Entry/>}/>
          <Route path='/Stock' element={<Stock/>}/>
          <Route path='/Daily' element={<Daily/>}/>
          <Route path='/update/:id' element={<UpdateProduct />} />
          <Route path="/add" element={<AddProduct />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
