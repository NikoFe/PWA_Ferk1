import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";

const Meals = ({ meals, setNewName, setIngredients, setMealId, setMeals, deleteMeal }) => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const fetchProtectedData = async () => {
    try {
      let accessToken = localStorage.getItem("accessToken");

      const headers = accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {};
      console.log("HEADERS: ",headers);
      const res = await axios.get("http://localhost:3000/meals", {
        headers,
      });

      setMeals(res.data.array);
      setShow(true)
      console.log("SUCCESS ", res.data.array);
      return
    } catch (err) {
        /*
      if (err.status === 403) {
        setMeals("");
        console.log("Refreshing token...");
        const refreshRes = await axios.post(
          "http://localhost:3000/refresh",
          {},
          { withCredentials: true }
        );
        localStorage.setItem("accessToken", refreshRes.data.accessToken);
        fetchProtectedData(); // Retry with new token
      } 
      
      else*/ {
        alert("access to meals denied!");
        setMeals("");
        navigate("/")
        console.error(err);
      }
    }
  };

  useEffect(() => {
    setShow(false);
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
