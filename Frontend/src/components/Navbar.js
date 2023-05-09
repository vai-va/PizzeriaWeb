import React from 'react';
import { Link } from 'react-router-dom'; // Import the Link component
import pizzaLogo from './assets/Pizzeria-logo.png';
import shoppingCartIcon from './assets/Shopping-cart.png';
import pizzaBackground from './assets/Pizza-background.jpg';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light navbar-background">
         <div className="navbar-content"></div>
            <div className="container d-flex">
            <div className="d-flex align-items-center justify-content-end w-100">
                <Link className="navbar-brand mx-auto" to="/">

                <a className="navbar-brand mx-auto" href="#"><img className="logo" src={pizzaLogo} alt="Pizza Logo" /></a>
                </Link>

                <ul className="navbar-nav">
                <li className="nav-item">
                    <Link className="nav-link" to="/order-summary">
                    <a className="nav-link" href="#"><img className="shoppingCart" src={shoppingCartIcon} alt="ShoppingCart" /></a>
                    </Link>
                </li>
                </ul>
            </div>
      </div>
    </nav>
  );
};

export default Navbar;
