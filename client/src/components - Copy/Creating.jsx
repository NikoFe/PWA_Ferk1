import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

const Creating = ({ setMeals,newName, setNewName,ingredients, setIngredients}) => {

  const API_URL = "http://localhost:3000";


  const getEntry = async () => {
    console.log("ADDING NEW MEAL");
    try {
      const response = await axios.post(API_URL + "/meals");
      console.log("RESPONSE: " + response[0]);
      //alert("GETTING")
    } catch (error) {console.log("CLIENT ERROR!")}
  };

  const createMealFunction= async (newMeal) => {
    console.log("NEWNEWNEW: "+JSON.stringify(newMeal));

    console.log("CREATING MEALS");
    try {
      //await axios.post(API_URL + "/meals", newMeal);
      
      const response = await axios.post(API_URL + "/meals", {
        newMeal: newMeal,
      })
    
      console.log("!!!!!!!!!!!!!!!!!CREATING RESPONSE: " +  response.data);
      //alert("GETTING")
    } catch (error) {
  
    console.log ("ERROR CREATING MEALS: "+error)
  
    }
  }
  
  const mealStateFunction = (
) => {
    let filled =true;

    for (let i=0; i<ingredients.length; i++){
      if(ingredients[i].name=="" || ingredients[i].amount==0 || ingredients[i].calories == 0){

       filled=false;
      }
    }
    if(newName=="" || newName =="0" || newName ==0 ){
        filled=false;
    
    }
       if(filled){

        const newMeal = {
              id: (Math.floor(Math.random()*9999)+300),
            name: newName,
            ingredients,
          };

          setMeals(prevMeals => [...prevMeals, newMeal]);
          setNewName("");
          setIngredients([
            { name: "", amount: "", calories: "" },
            { name: "", amount: "", calories: "" },
            { name: "", amount: "", calories: "" },
          ]);



          createMealFunction(newMeal)
         //  createMeal(newMeal)
       }
      else  {

        alert("please fill in all the inputs!")
       }
};

  const handleInputChange = (index, field, value) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index][field] = value;
    setIngredients(updatedIngredients);
  };

  return (
    <div className="creating-div">
      <p>Name:</p>
      <input
        type="text"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
      />

      <h3>INGREDIETNS: </h3>
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

      <button onClick={mealStateFunction}> CREATE</button>
    </div>
  );
};

export default Creating;
