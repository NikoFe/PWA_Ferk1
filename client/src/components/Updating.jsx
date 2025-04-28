import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const API_URL = "http://localhost:3000";




const Updating = ({setUpdating, setMeals,newName, setNewName,ingredients, setIngredients, mealId,updateMealFunction }) => {
  const navigate = useNavigate();
  const [showUpdating, setShowUpdating] = useState(false);

  ///////////////////////////
  const fetchProtectedData = async () => {
    try {
        let accessToken = localStorage.getItem("accessToken");
       
        const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
        console.log(headers)
        const res = await axios.get("http://localhost:3000/protected", {
         headers 
        });
        setShowUpdating(true)
         //setData(res.data.message);
    } catch (err) {
      {
            alert("access denied!")
            navigate("/")
            console.error(err);
        }
    }
};
  useEffect(() => {
    setShowUpdating(false);
    fetchProtectedData();
  }, []);



const handleInputChange = (index, field, value) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index][field] = value;
    setIngredients(updatedIngredients);
  };

const update= () =>{
  updateMealFunction();
  navigate("/meals")

}

 
  /*
  const updateMealFunction= async () => {//////////////////////////////////////////////////////////////////
    //console.log("updating: "+JSON.stringify(newMeal));

    if (!navigator.onLine) {
      try{
    console.log("MEAL UPDATE OFFLINE")

    let i=1;
    let updateString="update"+i;

    while(localStorage.getItem(updateString)!=""  && localStorage.getItem(updateString)){
    console.log("~~~~~~~~~~~~~",updateString,"~~~~~~~~~~~~~" )
    console.log("^^^^^^^",localStorage.getItem(updateString),"^^^^^^^")
    i++;
    updateString="update"+i;
    }

    const updatedMeal = {
      id: mealId,
      name: newName,
      ingredients,
    };
    localStorage.setItem(updateString, JSON.stringify(updatedMeal))
   
    }
    catch (err) {
      {
        alert("OFFLINE UPDATE ERROR!!!");
      
       // navigate("/")
        console.error(err);
      }
    }
    }  //OFFLINE

    console.log("UPDATING MEALS");
    try {

      const updatedMeal = {
        id: mealId,
        name: newName,
        ingredients,
      };
      console.log("URL: "+API_URL + "/meals/" +mealId,updatedMeal)
      const response = await axios.put(API_URL + "/meals/" +mealId,updatedMeal  )
      console.log("UPDATE RESPONSE: "+response)



     await  setMeals(prevMeals =>
        prevMeals.map(meal =>
          meal.id === mealId ? response.data : meal
        )
      );
     navigate("/")
    }
     catch (error) {
  
    console.log ("ERROR CREATING MEALS: "+error)
  
    }
  }*/

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
            id: uuidv4(),
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
         // updateMealFunction(newMeal)
         //  createMeal(newMeal)
       }
      else  {

        alert("please fill in all the inputs!")
       }
};

return (
<>

{showUpdating && 
    <div className="updating-div">
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

      <button onClick={()=>{update()}}> UPDATE</button>
    </div>
   }
</>
  );
}
export default Updating;

