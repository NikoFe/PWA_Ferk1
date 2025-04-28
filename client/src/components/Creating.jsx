import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Creating = ({ setMeals,newName, setNewName,ingredients, setIngredients, createMealFunction}) => {
  const navigate = useNavigate()
  const [showCreation, setShowCreation] = useState(false);

  const API_URL = "http://localhost:3000";

  const fetchProtectedData = async () => {
    try {
       setShowCreation(false);
        let accessToken = localStorage.getItem("accessToken");
       
        const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
        console.log(headers)


      
        const res = await axios.get("http://localhost:3000/protected", {
         headers 
        });
        setShowCreation(true)
         //setData(res.data.message);
    } catch (err) {
      {
            alert("access denied22!")
            navigate("/")
            console.error(err);
        }
    }
};
  useEffect(() => {

   
    console.log("useEffect");
    setShowCreation(true)




   // fetchProtectedData();
  }, []);

   /*
  const createMealFunction= async (newMeal) => {
    console.log("NEWNEWNEW: "+JSON.stringify(newMeal));
    if (!navigator.onLine) {
      try{
    console.log("MEAL CREATE OFFLINE")
    let i=1;
    let createString="create"+i;
    while(localStorage.getItem(createString)!=""  && localStorage.getItem(createString)){
    console.log("~~~~~~~~~~~~~",createString,"~~~~~~~~~~~~~" )
    console.log("^^^^^^^",localStorage.getItem(createString),"^^^^^^^")
    i++;
    createString="create"+i;
    }
    localStorage.setItem(createString, JSON.stringify(newMeal))
  
    }
    catch (err) {
      {
        alert("OFFLINE UPDATE ERROR!!!");
        console.error(err);
      }
    }
    }  //OFFLINE
   else {

    console.log("CREATING MEALS");
    try {
      const response = await axios.post(API_URL + "/meals", {
        newMeal: newMeal,
      })
      console.log("!!!!!!!!!!!!!!!!!CREATING RESPONSE: " +  response.data);
      //alert("GETTING")
    } catch (error) {
  
    console.log ("ERROR CREATING MEALS: "+error)

    }
  }
  }
  */
  const creatingFunction = (
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
          
             if (navigator.onLine) {
          setMeals(prevMeals => [...prevMeals, newMeal]);
          setNewName("");
          setIngredients([
            { name: "", amount: "", calories: "" },
            { name: "", amount: "", calories: "" },
            { name: "", amount: "", calories: "" },
          ]);
        }


          createMealFunction(newMeal)
          navigate("/")
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

   <>
      {showCreation && 

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

      <button onClick={creatingFunction}> CREATE</button>

  
    </div>
      }
    </>
  );
};

export default Creating;
