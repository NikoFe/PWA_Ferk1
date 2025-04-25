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
  const [name, setName] = useState("");
  const [count, setCount] = useState(0);

  const deleteMeal = async (idParam) => {
    console.log("DELETING " + API_URL + "/meals/" + idParam);
    try {
      const response = await axios.delete(API_URL + "/meals/" + idParam);

      console.log("delete RESPONSE: " + response[0]);
      setLoggedIn(true);
      // setRefresh(!refresh)
      //alert("GETTING")
    } catch (error) {
      console.log("DELETE ERROR: " + error);
    }
  };


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
