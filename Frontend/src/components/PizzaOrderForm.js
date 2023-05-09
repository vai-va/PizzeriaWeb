import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Define the PizzaOrderForm component, which takes orders and setOrders as props
const PizzaOrderForm = ({ orders, setOrders }) => {
  // Declare state variables for pizza sizes, selected size, toppings, and other UI elements
  const [sizes, setSizes] = useState([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [toppings, setToppings] = useState([]);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [showSizeWarning, setShowSizeWarning] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [totalCost, setTotalCost] = useState(0);

  // Display order confirmation message for 3.5 seconds
  const displayConfirmation = () => {
    setShowConfirmation(true);
    setTimeout(() => {
      setShowConfirmation(false);
    }, 3500);
  };



  
  // Function to save the order and reset the form
  const handleSaveOrder = async () => {
    //Find the selected pizza size from the available sizes
    const selectedPizza = sizes.find((s) => s.size === selectedSize);
    // Show a warning if no size is selected, otherwise hide the warning
    if (!selectedPizza) {
      setShowSizeWarning(true);
      return;
    } else {
      setShowSizeWarning(false);
    }

    // Filter the selected toppings objects from the available toppings
    const selectedToppingsObjects = toppings.filter((t) =>
      selectedToppings.includes(t.name)
    );

    // Create the order object with the selected pizza and toppings
    const order = {
      pizza: selectedPizza,
      toppings: selectedToppingsObjects,
    };

    // Calculate the total price of the order
    let totalPrice = 0;
    try {
      const response = await axios.post(
        "https://localhost:7223/PizzaOrders/calculateTotalCost",
        order
      );
      totalPrice = response.data;
    } catch (error) {
      console.error("Error calculating total price:", error);
      return;
    }

    // Set the total cost of the order
    setTotalCost(totalPrice.toFixed(2));

    // Create a new order object with the total cost
    const newOrder = {
      ...order,
      totalCost: totalPrice.toFixed(2),
    };

    // Save the new order to the backend and update the orders state
    try {
      const response = await axios.post(
        "https://localhost:7223/PizzaOrders",
        newOrder
      );
      setOrders([...orders, response.data]);
      displayConfirmation();
    } catch (error) {
      console.error("Error saving order:", error);
    }

    // Reset the form by clearing the selected size and toppings
    setSelectedSize("");
    setSelectedToppings([]);
  };

   // Function to fetch pizza sizes and prices from the backend
  const fetchSizesAndPrices = async () => {
    try {
      // Fetch all pizza IDs
      const response = await axios.get('https://localhost:7223/PizzaOrders/allPizzaIds');
      const pizzaIds = response.data;

        // If there are any pizza IDs, fetch the corresponding size and price data
      if (pizzaIds && pizzaIds.length > 0) {
        const queryString = pizzaIds.map(id => `pizzaIds=${id}`).join('&');
        const sizesResponse = await axios.get(`https://localhost:7223/PizzaOrders/pizzaSizeAndPrice?${queryString}`);
        // Set the fetched sizes to the sizes state
        setSizes(sizesResponse.data);
      }
    } catch (error) {
      console.error("Error fetching sizes and prices:", error);
    }
  };

  // Function to fetch toppings data from the backend
  const fetchToppingsData = async () => {
    try {
      // Function to fetch toppings data from the backend
      const response = await axios.get('https://localhost:7223/PizzaOrders/allToppingIds');
      const toppingIds = response.data;

      // If there are any topping IDs, fetch the corresponding name and price data
      if (toppingIds && toppingIds.length > 0) {
        const queryString = toppingIds.map(id => `toppingIds=${id}`).join('&');
        const toppingsResponse = await axios.get(`https://localhost:7223/PizzaOrders/toppingNameAndPrice?${queryString}`);
        setToppings(toppingsResponse.data);
      }
    } catch (error) {
      console.error("Error fetching toppings data:", error);
    }
  };


  // useEffect hook to fetch sizes, prices, and toppings data when the component mounts
  useEffect(() => {
    const fetchToppings = async () => {
      try {
        const response = await axios.get('https://localhost:7223/PizzaOrders/toppingNameAndPrice');
        setToppings(response.data);
      } catch (error) {
        console.error('Error fetching toppings:', error);
      }
    };
  
    fetchSizesAndPrices();
    fetchToppingsData();
  }, []);

  // Function to handle size button click
  const handleSizeClick = (size) => {
    if (selectedSize === size) {
      setSelectedSize('');
    } else {
      setSelectedSize(size);
    }
  };

  // Function to handle topping checkbox change
  const handleToppingChange = (event, topping) => {
    const label = event.target.closest('label');
    label.classList.toggle('active');
  
    if (event.target.checked) {
      setSelectedToppings([...selectedToppings, topping]);
    } else {
      setSelectedToppings(selectedToppings.filter(t => t !== topping));
    }
  };

return (
    <div className="container pizza-order-form">
      <form>
        <div className="form-group">
          <div>
            <label htmlFor="size" className="label-margin title-text">Build your own pizza</label>
          </div>
          <div>
            <label htmlFor="size" className="label-margin">Choose your pizza's size</label>
          </div>
          <div className="btn-group btn-group-toggle" data-toggle="buttons">
            {sizes.map(({ size, price }) => (
              <label
                key={size}
                className={`btn btn-light btn-outline-dark btn-lg pizza-size-button ${
                  selectedSize === size ? 'active' : ''
                }`}
                onClick={() => handleSizeClick(size)}
              >
                {size}
                <br />
                {price}€
              </label>
            ))}
          </div>
          <div>
            <label htmlFor="size" className="label-margin">Choose your pizza's toppings</label>
          </div>
          <p className="discount-message">Choose more than 3 different toppings and get a 10% discount on your order!</p>
          <div className="row">
            {toppings.map(({ name, price }) => (
              <div className="col-6 col-md-3">
                <label
                  key={name}
                  className={`btn btn-light btn-outline-dark btn-lg pizza-topping-button ${
                    selectedToppings.includes(name) ? 'active' : ''
                  }`}
                  data-toggle="button"
                  style={{ width: '100%', marginBottom: '1rem' }}
                >
                  <input
                    type="checkbox"
                    className="btn-check"
                    name="topping"
                    value={name}
                    onChange={(event) => handleToppingChange(event, name)}
                    checked={selectedToppings.includes(name)}
                    autoComplete="off"
                  />
                  {name}
                  <br />
                  {price}€
                </label>
              </div>
            ))}
          </div>
          <button type="button" onClick={handleSaveOrder} className="btn btn-primary btn-dark btn-lg">
            Save Order
          </button>
          {showSizeWarning && (
            <p className="text-danger mt-2">Please select the pizza's size.</p>
          )}
        </div>
        {}
        {showConfirmation && (
          <div className={`confirmation-message${showConfirmation ? " show-confirmation" : ""}`}>
            Order saved successfully!
          </div>
        )}
      </form>
    </div>
  );
};

export default PizzaOrderForm;