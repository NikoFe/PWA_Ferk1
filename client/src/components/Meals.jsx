import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";



const Meals = ({ meals, setNewName, setIngredients, setMealId, setMeals, deleteMeal,filterName,filterId,filterIngredients,setFilterName, setFilterId,setFilterIngredients }) => {

 // const [filterName, setFilterName] = useState("");
 // const [filterId, setFilterId] = useState(0);
 // const [filterIngredients, setFilterIngredients ]=useState([])
  const [showFilter, setShowFilter] = useState(false);
  const [filtering, setFiltering] = useState(true);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);


  const findSingle = async (/*filterName,*/filterId) =>{

    console.log("SINGLE URL: ","http://localhost:3000/meals/"+filterId )
    const res = await axios.get("http://localhost:3000/meals/"+filterId);
    //alert("SINGLE MEAL RESULT: ||",res.data,"||" )
   // console.log("SINGLE MEAL RESULT: ||",res.data,"||" )
     //meals.filter(res.data)

    const filtered = meals.filter(meal =>
      meal.id === parseInt(res.data)
    );
 
    if(filtered[0]){

    console.log("FILTERED: ", filtered[0])
     console.log("FILTERED id: ", filtered[0].id)
     console.log("FILTERED name: ", filtered[0].name)
     console.log("FILTERED ingredients: ", filtered[0].ingredients)


    setFilterId(filtered[0].id)
    setFilterName(filtered[0].name)
    setFilterIngredients(filtered[0].ingredients)
    navigate("/meals/"+ filterId)
  }

  }











  const fetchProtectedData = async () => {
   
    if (!navigator.onLine) {
      try{
    console.log("MEAL GET OFFLINE 2.0 !")

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

      setMeals(res.data.array);
      localStorage.setItem("latestMeals",JSON.stringify(res.data.array) );
      let jsonArrayTest= JSON.parse(localStorage.getItem("latestMeals"))
      //console.log("JSON TEST: ",jsonArrayTest)
      //console.log("SUCCESS ", res.data.array);
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
      <h1>MEALS: </h1>
       <button onClick={() => {setShowFilter(true)}}>Filter</button>
        {showFilter && 
        <div  className="meal-filter-div"> 
         {/*
         <p>Name:</p>
          <input
            type="text"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
           // onChange={(e) => handleInputChange(index, "name", e.target.value)}
          />*/
        }
        <p>ID:</p>
          <input
            type="number"
            value={filterId}
            onChange={(e) => setFilterId(e.target.value)}
           // onChange={(e) => handleInputChange(index, "name", e.target.value)}
          />
          
          <button onClick={() => {findSingle(/*filterName,*/filterId)}}>FILTER</button>
           </div>
        }

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
