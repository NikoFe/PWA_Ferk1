import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";

const Meals = ({ meals, setNewName, setIngredients, setMealId, setMeals, deleteMeal }) => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const fetchProtectedData = async () => {
   
    if (!navigator.onLine) {
      try{
    console.log("MEAL GET OFFLINE 2.0 !")

    /*
    const latestMeals = localStorage.getItem("latestMeals");
    if (latestMeals) {
      console.log("A")
      setMeals(JSON.parse(latestMeals));
    }
    console.log("B")*/

    setShow(true)
    //navigate("/")
    }

    catch (err) {
      {
        alert("MEAL DENIED ERROR!!!");
      
       // navigate("/")
        console.error(err);
      }

    }
    }

    else {
    try {
      let accessToken = localStorage.getItem("accessToken");

      const headers = accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {};
      console.log("HEADERS: ",headers);
      const res = await axios.get("http://localhost:3000/meals", {
        headers,
      });
      console.log("ARRAY: ",res.data)
      console.log("STRING ARRAY: ",JSON.stringify(res.data))
      console.log("33333333333333333")
      setMeals(res.data.array);
      localStorage.setItem("latestMeals",JSON.stringify(res.data.array) );
      let jsonArrayTest= JSON.parse(localStorage.getItem("latestMeals"))
      console.log("JSON TEST: ",jsonArrayTest)


      console.log("SUCCESS ", res.data.array);
      return
    } catch (err) {
      {
        alert("access to meals denied!");
      
        navigate("/")
        console.error(err);
      }
    }
  }

  };

  useEffect(() => {
    setShow(true);
    fetchProtectedData();
  }, []);

  return (
  
    <>
     {show &&
     <>
      <button
        onClick={() => {
          navigate("/");
        }}
      >
        HOME
      </button>
      <div className="ingredients-div">
      <h1>INGREDIENTS: </h1>
        {meals.map((meal, index) => (
          <div key={index} className="ingredient-div">
            <strong> {meal.name} </strong>

            {meal.ingredients.map((ing, index) => (
              <p>
                {" "}
                {ing.name + " " + ing.amount + "g " + ing.calories + "cal"}{" "}
              </p>
            ))}
            <div className="horizontal-flex">
              <strong>MEAL ID: {meal.id} </strong>
              <button
                onClick={() => {
                  setNewName(meal.name);
                  setIngredients(meal.ingredients);
                  setMealId(meal.id);
                  navigate("/update");
                }}
              >
                UPDATE
              </button>

              <button
                onClick={() => {
                  deleteMeal(meal.id);
                }}
              >
                DELETE
              </button>
          
            </div>
          </div>
        ))}
      </div>
      </>
    }
    </>
  
  );
};

export default Meals;
