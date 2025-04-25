import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000";

const Creating = ({ setMeals }) => {
  const [mealName, setMealName] = useState("");
  const [ingredients, setIngredients] = useState([
    { name: "", amount: "", calories: "" },
    { name: "", amount: "", calories: "" },
    { name: "", amount: "", calories: "" },
  ]);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await axios.get(API_URL + "/meals");
        setMeals(response.data);
      } catch (error) {
        console.log("ERROR!!!!!!!!: ", error);
      }
    };
    fetchMeals();
  }, [setMeals]);

  const handleInputChange = (index, field, value) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index][field] = value;
    setIngredients(updatedIngredients);
  };

  const createMeal = () => {
    if (!mealName.trim() || ingredients.some(ing => !ing.name.trim() || !ing.amount || !ing.calories)) {
      alert("Please fill in all fields.");
      return;
    }

    const newMeal = {
      name: mealName,
      ingredients,
    };

    setMeals(prevMeals => [...prevMeals, newMeal]);
    setMealName("");
    setIngredients([
      { name: "", amount: "", calories: "" },
      { name: "", amount: "", calories: "" },
      { name: "", amount: "", calories: "" },
    ]);
  };

  return (
    <div className="creating-div">
      <p>Name:</p>
      <input
        type="text"
        value={mealName}
        onChange={(e) => setMealName(e.target.value)}
      />

      <h3>INGREDIENTS:</h3>
      {ingredients.map((ingredient, index) => (
        <div key={index} className="creating-ingredient">
          <p>Name:</p>
          <input
            type="text"
            value={ingredient.name}
            onChange={(e) => handleInputChange(index, "name", e.target.value)}
          />
          <p>Amount:</p>
          <input
            type="number"
            min={0}
            value={ingredient.amount}
            onChange={(e) => handleInputChange(index, "amount", e.target.value)}
          />
          <p>Calories:</p>
          <input
            type="number"
            min={0}
            value={ingredient.calories}
            onChange={(e) => handleInputChange(index, "calories", e.target.value)}
          />
        </div>
      ))}

      <button onClick={createMeal}>CREATE</button>
    </div>
  );
};

export default Creating;
