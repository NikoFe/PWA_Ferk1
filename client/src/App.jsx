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
import { useNavigate } from "react-router-dom";
import KeyHandler from "./components/KeyHandler";
import SingleMeal from "./components/SingleMeal";
import { urlBase64ToUint8Array } from "./utils";

//<link rel="stylesheet" type="text/css" href="path/to/notifications.css"></link>

//class Example extends React.Component {
//}

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
  const [filterName, setFilterName] = useState("");
  const [filterId, setFilterId] = useState(0);
  const [filterIngredients, setFilterIngredients ]=useState([
    { name: "", amount: 0, calories: 0 },
    { name: "", amount: 0, calories: 0 },
    { name: "", amount: 0, calories: 0 },
  ])

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isOnline, setIsOnline]= useState(true)

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    async function setupPush() {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

      const reg = await navigator.serviceWorker.register("./public/serviceWorker.js");
      console.log("REG: |||||||", reg,"||||||||||||||||")
      const res = await fetch("http://localhost:3000/vapidPublicKey");
      console.log("SETUP push: ",res)
      const vapidPublicKey = await res.text();
      const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
      console.log("Converted key: ",convertedVapidKey)
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey
      });
      console.log("sub before subscribe: ",sub)
      await fetch("http://localhost:3000/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub)
      });
    }

    setupPush();
  }, []);


  
  const triggerPush = async () => {
   const res = await fetch("http://localhost:3000/notify", { method: "POST" });
    console.log("triggerPush response: "+res)
  };
  
  const createPush = async () => {
    const res = await fetch("http://localhost:3000/notifyCreate", { method: "POST" });
    console.log("CREATING NOTIFY")
    console.log("triggerPush response: "+res)
  };
  const errorPush = async () => {
    const res = await fetch("http://localhost:3000/notifyError", { method: "POST" });

    console.log("triggerPush response: "+res)
  };



/*
  const errorPush = async () => {
    res = await fetch("http://localhost:3000/notifyError", { method: "POST" });

    console.log("triggerPush response: "+res)
  };
*/


////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const handleCheck = ()=>{
    setIsOnline(navigator.isOnline)
    if(navigator.isOnline){
      console.log(    navigator.isOnline)
    }
    else{
            let i=1
            let updateString="update"+i;
            while(localStorage.getItem(updateString)!=""  && localStorage.getItem(updateString)){

                let parsedCreate = JSON.parse(localStorage.getItem(updateString)); // just parse directly!
                console.log("UPDATINGUPDATINGUPDATINGUPDATINGUPDATING")
                updateMealFunction(parsedCreate.id,parsedCreate.name,parsedCreate.ingredients,true );
                localStorage.removeItem(updateString)
                i++;
                updateString="update"+i;
                }
            i=1
            let deleteString="delete"+i;
            while(localStorage.getItem(deleteString)!=""  && localStorage.getItem(deleteString)){

                //let parsedDelete = JSON.parse(localStorage.getItem(deleteString)); // just parse directly!
                console.log("DELETEDELETEDELETEDELETEDELETEDELETE")
                deleteMeal(localStorage.getItem(deleteString));
                localStorage.removeItem(deleteString)
                i++;
                deleteString="update"+i;
                }
            i=1
            let createString="create"+i;
            while(localStorage.getItem(createString)!=""  && localStorage.getItem(createString)){

            let parsedCreate = JSON.parse(localStorage.getItem(createString)); // just parse directly!
            console.log("CREATINGCREATINGCREATINGCREATINGCREATINGCREATINGCREATINGCREATINGCREATINGCREATING")
            createMealFunction(parsedCreate);
            localStorage.removeItem(createString)

            i++;
            createString="create"+i;
            }


      console.log("********************************************************************************")
    }
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const updateMealFunction= async (paramId, paramName, paramIngredients, isParams) => {//////////////////////////////////////////////////////////////////
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
    console.log("storing new IIIII: ",JSON.stringify(updatedMeal) )
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
    else {
    try {
      let updatedMeal = {
        id: mealId,
        name: newName,
        ingredients,
      };
    
    if(isParams) {
       updatedMeal = {
        id: paramId,
        name: paramName,
        ingredients:paramIngredients,
      };
    }
    console.log("URL: "+API_URL + "/meals/" +mealId,updatedMeal)
    const response = await axios.put(API_URL + "/meals/" +updatedMeal.id,updatedMeal  )
    console.log("UPDATE RESPONSE: "+response)
    await  setMeals(prevMeals =>
       prevMeals.map(meal =>
         meal.id === updatedMeal.id ? response.data : meal
       )
    );
    }
     catch (error) {
    console.log ("ERROR CREATING MEALS: "+error)
    }
  }
  }

  useEffect(() => {
   window.addEventListener("online",handleCheck )
  }, []);
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const deleteMeal = async (idParam) => {
    console.log("DELETING idParam: ", idParam)
    if (!navigator.onLine) {
      try{
    console.log("MEAL DELETE OFFLINE")
    let i=1;
    let deleteString="delete"+i;
    while(localStorage.getItem(deleteString)!=""  && localStorage.getItem(deleteString)){
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
    }//OFFLINE
    else {
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
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
      createPush();
      console.log("!!!!!!!!!!!!!!!!!CREATING RESPONSE: " +  response.data);
      //alert("GETTING")
    } catch (error) {
    console.log ("ERROR CREATING MEALS: "+error)
    errorPush();
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
  
  return (
    <>
      <BrowserRouter>
       <KeyHandler />
        <Routes>
          <Route
            path="/"
            element={
              <Home
                triggerPush={triggerPush}
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
                filterName={filterName}
                filterId={filterId}
                filterIngredients={filterIngredients}
                setFilterName={setFilterName}
                setFilterId={setFilterId}
                setFilterIngredients={setFilterIngredients}
              ></Meals>

            }
          />

           (filterId,filterName,filterIngredients,setNewName,setIngredients,setMealId,deleteMeal) 

          <Route
            path="/meals/:id"
            element={
              <SingleMeal
                filterId={filterId}
                filterName={filterName}
                filterIngredients={filterIngredients}
                setNewName={setNewName}
                setIngredients={setIngredients}
                setMealId={setMealId}
                deleteMeal={deleteMeal}
              ></SingleMeal>

            }
          />



        </Routes>
        <></>
      </BrowserRouter>
  
    </>
  );
}

export default App;
