import { useState, useEffect } from "react";
import SignIn from "./components/SignIn";
import "./App.css";
import axios from "axios";
import Creating from "./components/Creating";
import Updating from "./components/Updating";
import Home from "./components/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Protected from "./components/Protected";
import Meals from "./components/Meals";

//const API_URL="h"
const API_URL = "http://localhost:3000";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/serviceWorker.js")
      .then(res => console.log("Service Worker registered"))
      .catch(err => console.log("Service Worker not registered", err));
  });
}

const getEntry = async () => {
  console.log("GETTING");
  try {
    const response = await axios.get(API_URL + "/statistics");
    console.log("RESPONSE: " + response[0]);
    //alert("GETTING")
  } catch (error) {}
};

function App() {
  const [loggedIn, setLoggedIn] = useState(0);
  const [meals, setMeals] = useState([]);
  const [refresh, setRefresh] = useState(true);
  const [newName, setNewName] = useState(0);
  const [mealId, setMealId] = useState(0);
  const [ingredients, setIngredients] = useState([
    { name: "", amount: 0, calories: 0 },
    { name: "", amount: 0, calories: 0 },
    { name: "", amount: 0, calories: 0 },
  ]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isOnline, setIsOnline]= useState(true)

  const handleCheck = ()=>{
    console.log("ONLINE CHECK!!!!!!!!!!!!!!!!!!")
    setIsOnline(navigator.isOnline)

    if(navigator.isOnline){
      console.log(    navigator.isOnline)
      console.log("*** IS ONLINE")
    }
    else{
      console.log(    navigator.isOnline)
      console.log("*** NOT ONLINE ******************************************************************************")

         

            let i=1
            let createString="create"+i;
            console.log(localStorage.getItem(createString))
            console.log(localStorage.getItem(createString="create"+i))
            while(localStorage.getItem(createString)!=""  && localStorage.getItem(createString)){



                let parsedCreate = JSON.parse(localStorage.getItem(createString)); // just parse directly!
                console.log("CREATINGCREATINGCREATINGCREATINGCREATINGCREATINGCREATINGCREATINGCREATINGCREATING")
                createMealFunction(parsedCreate);
                localStorage.removeItem(createString)

     
          //  createMealFunction(parsedCreate)

                i++;
                createString="create"+i;
        
            }
          
      console.log("********************************************************************************")

    }
  }

  useEffect(() => {
   // window.addEventListener('online',   console.log("ONLINE CHECK: !" ));
     //handleCheck()
    //return () => window.removeEventListener('online', fetchProtectedData);
   window.addEventListener("online",handleCheck )
  // window.addEventListener("offline",handleCheck )
  }, []);
  
  const deleteMeal = async (idParam) => {
    if (!navigator.onLine) {
      try{
    console.log("MEAL DELETE OFFLINE")
    let i=1;
    let deleteString="delete"+i;
    while(localStorage.getItem(deleteString)!=""  && localStorage.getItem(deleteString)){
    //console.log("~~~~~~~~~~~~~",deleteString,"~~~~~~~~~~~~~" )
    //console.log("^^^^^^^",localStorage.getItem(deleteString),"^^^^^^^")
    i++;
    deleteString="delete"+i;
    }
    localStorage.setItem(deleteString, idParam)
    }
    catch (err) {
      {
        alert("OFFLINE UPDATE ERROR!!!");
        console.error(err);
      }
    }
    }  
    else {
    
    //OFFLINE
    console.log("DELETING " + API_URL + "/meals/" + idParam);
    try {
      const response = await axios.delete(API_URL + "/meals/" + idParam);
      console.log("delete RESPONSE: " + response[0]);
      setLoggedIn(true);
    } catch (error) {
      console.log("DELETE ERROR: " + error);
    }
  }
  };
  const createMealFunction= async (newMeal) => {
    console.log("NEWNEWNEW: "+JSON.stringify(newMeal));
    if (!navigator.onLine) {
      try{
    console.log("MEAL CREATE OFFLINE")
    let i=1;
    let createString="create"+i;
    while(localStorage.getItem(createString)!=""  && localStorage.getItem(createString)){
    //console.log("~~~~~~~~~~~~~",createString,"~~~~~~~~~~~~~" )
    //console.log("^^^^^^^",localStorage.getItem(createString),"^^^^^^^")
    i++;
    createString="create"+i;
    }
    localStorage.setItem(createString, JSON.stringify(newMeal))
    }
    catch (err) {
      {
        alert("OFFLINE CREATE ERROR!!!");   
        console.error(err);
      }
    }
    }  //OFFLINE
   else {
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
  }
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await axios.get(API_URL + "/meals");
        setMeals(response.data); // Store data in state if needed
      } catch (error) {
        console.log("FETCH MEALS ERROR!!!!!!!!: ", error);
      }
    };
    fetchMeals(); // Call the async function inside useEffect
  }, []);
  
  const updateMealFunction= async () => {//////////////////////////////////////////////////////////////////
    //console.log("updating: "+JSON.stringify(newMeal));
    if (!navigator.onLine) {
      try{
    console.log("MEAL UPDATE OFFLINE")

    let i=1;
    let updateString="update"+i;
    while(localStorage.getItem(updateString)!=""  && localStorage.getItem(updateString)){
    //console.log("~~~~~~~~~~~~~",updateString,"~~~~~~~~~~~~~" )
    //console.log("^^^^^^^",localStorage.getItem(updateString),"^^^^^^^")
    i++;
    updateString="update"+i;
    }
    const updatedMeal = {
      id: mealId,
      name: newName,
      ingredients,
    };
    console.log("storing new IIIII: ",updateString )
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
     //
    }
     catch (error) {
  
    console.log ("ERROR CREATING MEALS: "+error)
  
    }
  }
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                getEntry={getEntry}
                setNewName={setNewName}
                setIngredients={setIngredients}
                setMealId={setMealId}
                deleteMeal={deleteMeal}
                meals={meals}
                setUsername={setUsername}
                setPassword={setPassword}
                setMeals={setMeals}
              />
            }
          />
          <Route
            path="/login"
            element={
              <SignIn
                setLoggedIn={(value) => {
                  setLoggedIn(value);
                }}
                username={username}
                setUsername={setUsername}
                password={password}
                setPassword={setPassword}
              ></SignIn>
            }
          />
          <Route
            path="/create"
            element={
              <Creating
                setMeals={setMeals}
                newName={newName}
                setNewName={setNewName}
                ingredients={ingredients}
                setIngredients={setIngredients}
                createMealFunction={createMealFunction}
              />
            }
          />
          <Route
            path="/update"
            element={
              <Updating
                setMeals={setMeals}
                newName={newName}
                setNewName={setNewName}
                ingredients={ingredients}
                setIngredients={setIngredients}
                mealId={mealId}
                updateMealFunction={updateMealFunction}
              ></Updating>
            }
          />
          <Route path="/protected" element={<Protected></Protected>} />
          <Route
            path="/meals"
            element={
              <Meals
                meals={meals}
                setNewName={setNewName}
                setIngredients={setIngredients}
                setMealId={setMealId}
                setMeals={setMeals}
                deleteMeal={deleteMeal}
              ></Meals>
            }
          />
        </Routes>
        <></>
      </BrowserRouter>
    </>
  );
}

export default App;
