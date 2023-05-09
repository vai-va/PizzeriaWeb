const handleToppingChange = (e, toppingName) => {
    if (e.target.checked) {
      setSelectedToppings([...selectedToppings, toppingName]);
    } else {
      setSelectedToppings(selectedToppings.filter((name) => name !== toppingName));
    }
  };
  
  const order = {
    size: selectedSize,
    toppings: selectedToppings,
    // ...other properties
  };