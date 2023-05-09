import React, { useState, useEffect } from 'react';

// Define the OrderSummary functional component, which receives an orders prop
const OrderSummary = ({ orders }) => {
  const [totalPrice, setTotalPrice] = useState(null);

  // useEffect to fetch data
  useEffect(() => {
    fetch('https://localhost:7223/PizzaOrders/totalOrdersPrice')
      .then(res => res.json())
      .then(data => setTotalPrice(data.totalPrice))
      .catch(err => console.error(err));
  }, []);
  
  return (
    <div className="container order-summary">
      <h2>Order Summary</h2>
      <ul>
        {orders.map((order, index) => (
          <li key={order.id} className="order-container">
            <p>Pizza: {order.pizza.size}</p>
            <p>
              Toppings:{" "}
              {order.toppings.length === 0
                ? "none"
                : order.toppings.map((topping) => topping.name).join(", ")}
            </p>
            <p>Total Price: {order.totalCost}€</p>
          </li>
        ))}
      </ul>
      {totalPrice !== null && <p className="total-price"><b>Total Price of all Orders: {totalPrice}€</b></p>}
    </div>
  );
};

export default OrderSummary;
