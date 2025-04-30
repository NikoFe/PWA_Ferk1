import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

const SingleMeal = ({filterId,filterName,filterIngredients,setNewName,setIngredients,setMealId,deleteMeal}) => {
    useEffect(() => {
        console.log("SINGLE id: ", filterId)
        console.log("SINGLE NAME: ",filterName)
        console.log("SINGLE INGREDIENTS: ", filterIngredients)
       }, []);

    const navigate = useNavigate();
  return (
    <>
        <button
        onClick={() => {
            navigate("/");
        }}
        >
        HOME
        </button>


  {
    <div key={filterId} className="ingredient-div">

    <strong> {filterName} </strong>

    {filterIngredients.map((ing, index) => (
      <p>
        {" "}
        {ing.name + " " + ing.amount + "g " + ing.calories + "cal"}{" "}
      </p>
    ))}
    <div className="horizontal-flex">
      <strong>MEAL ID: {filterId} </strong>
      <button
        onClick={() => {
          setNewName(filterName);
          setIngredients(filterIngredients);
          setMealId(filterId);
          navigate("/update");
        }}
      >
        UPDATE
      </button>

      <button
        onClick={() => {
          deleteMeal(filterId);
        }}
      >
        DELETE
      </button>
  
    </div>
  </div>
}
<div>AAA</div>
</>
  )
}

export default SingleMeal