import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PizzaOrderForm from './components/PizzaOrderForm';
import OrderSummary from './components/OrderSummary';
import NavBar from './components/Navbar';
import './App.css';

function App() {
  const [orders, setOrders] = useState([]);

  return (
    <div className="App">
      <Router>
        <NavBar />
        <div className="rectangle">
          <Routes>
            <Route path="/" element={<PizzaOrderForm orders={orders} setOrders={setOrders} />} />
            <Route path="/order-summary" element={<OrderSummary orders={orders} />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
