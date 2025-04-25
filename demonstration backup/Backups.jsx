///App.jsx


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


Meals.jsx:

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


//Signin.jsx

import React, { useEffect, useState,} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignIn = ({ username, setUsername, password, setPassword }) => {

  const navigate = useNavigate();

  const validate = async () =>  {
    if (username != "" && password != "") {
      console.log("USERNAME: " + username + " PASSWORD: " + password);
      const res = await axios.post("http://localhost:3000/login", { username, password }, { withCredentials: true });
            localStorage.setItem("accessToken", res.data.accessToken);
            
            navigate("/");
    }
    return;
  };
  return (
    <div className="signin_div">
      <button onClick={()=>{navigate("/")}}>HOME</button>
      <input
        type="text"
        placeholder="user1 "
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="text"
        placeholder="pass1"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={validate}>log in </button>
    </div>
  );
};

export default SignIn;
/// app.jsx


const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//const fs = require('fs')
const REFRESH_TOKENS = new Set();
const SECRET_KEY = "secret_key_value";
const REFRESH_SECRET = "refresh_key";

const fs = require('fs').promises;

const app = express();
//app.use(cors());
app.use(
  cors({
    origin: "http://localhost:5173", // Allow frontend origin
    credentials: true, // Allow credentials (cookies, authorization headers)
  })
);

const PORT = 3000;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const readfile = async (path) => {
  try {
    const data = await fs.readFile(path, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading or parsing file:", err);
    throw err;
  }
};

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log("HEADER:   |||||"+header+"|||||||||")
  token = authHeader.split(" ")[1] && authHeader;

  if (!token) return res.status(401).json({ error: "No token provided" });

  const token = 
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("Token verification failed:", err);
      return res.status(403).json({ error: "Token expired or invalid" });
    }
    req.user = decoded; // Store user info in request
    next();
  });
};

const generateTokens = (username, password) => {
  console.log("USERNAME PASSWORD: "+username+" "+password)
  
  console.log("SIGNED !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1")
  const accessToken = jwt.sign({ username: username, password:password }, SECRET_KEY, { expiresIn: "1m" });
  //SECRET_KEY="Bearer "+accessToken
  //console.log("SECRET KEY: ",SECRET_KEY )
  const refreshToken = jwt.sign({ username: username, password:password }, REFRESH_SECRET, { expiresIn: "7d" });
  REFRESH_TOKENS.add(refreshToken);
  return { accessToken, refreshToken };
};

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  /*const user = users.find((u) => u.username === username);
  if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
  }*/
  const { accessToken, refreshToken } = generateTokens(username,password);
  res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });

  res.json({ accessToken });
});


app.get("/protected", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Token required" });

  const token = authHeader.split(" ")[1];

  jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) return res.status(403).json({ error: "Invalid token" });
      res.json({ message: "Sensitive data", user });
  });
});

/*WIP
app.post("/users", async (req,res) => {

  try{
    const jsonarray = await fs.readFile("jsons/users.json", 'utf-8'); 
    //const jsonarray =  await readfile("jsons/users.json"); // Await it!
    let userData = JSON.parse(jsonarray);
    
    //const { username, password } = req.body;

   // const result = data.filter((user) =>{user.name == username && user.password==password }   );

    return res.status(201).send({resultMsg: userData}); // Send the actual data
  }
  catch(error){
    console.error("Error fetching users:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
})*/


app.get("/meals", async (req,res) => {

  const authHeader = req.headers.authorization;
  //const token = authHeader.split(" ")[1] && authHeader;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token ) return res.status(401).json({ error: "Token required" });
  
  console.log("GET MEAL TOKEN: |",token,"|")
  console.log("SECRET KEY: |", SECRET_KEY,"|")


  jwt.verify(token, SECRET_KEY, async (err,user) => {
      if (err) return res.status(403).json({ error: "Invalid token" });
 
     try{
      const jsonarray =  await readfile("jsons/meals.json"); // Await it!
      return res.status(201).json( { array:jsonarray  }  ); // Send the actual data
    }
    catch(error){
      console.error("File read error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
    });
  })


app.post("/refresh", (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken || !REFRESH_TOKENS.has(refreshToken)) {
      return res.status(403).json({ error: "Unauthorized" });
  }

  jwt.verify(refreshToken, REFRESH_SECRET, (err, user) => {
      if (err) return res.status(403).json({ error: "Invalid token" });

      const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);
      REFRESH_TOKENS.delete(refreshToken);
      REFRESH_TOKENS.add(newRefreshToken);

      res.cookie("refreshToken", newRefreshToken, { httpOnly: true, secure: true });
      res.json({ accessToken });
  });
});


app.get("/statistics", (req,res) => {
res.status(200).send({
 message: "SUCCESS"
}
)
})

  app.delete("/meals/:id", async (req, res) => {

    try {
      console.log("Incoming Body:",req.params); // Log incoming data
      const jsonarray = await fs.readFile("jsons/meals.json", 'utf-8'); 
      let data = JSON.parse(jsonarray);

      const id = req.params.id;
      console.log("id to delete:", id);
      const result = data.filter((meal) => meal.id != id);

      console.log("|||||||||||||RESULT: "+result)

      await fs.writeFile("jsons/meals.json", JSON.stringify(result, null, 2));
  
      // Respond with the updated data
      res.status(201).json(result);
      
    } catch (error) {
      console.log("JSON ARRAY Error:", error.message);
      res.status(500).send({ message: error.message });
    }
  });

    app.post("/meals", async (req, res) => {
      try {
        console.log("Incoming Body:", JSON.stringify(req.body, null, 2)); // Log incoming data
    
        const jsonarray = await fs.readFile("jsons/meals.json", 'utf-8'); 
        console.log("Raw JSON String:", jsonarray);
    
        let data = JSON.parse(jsonarray);
  
        const newElement = req.body.newMeal || req.body;
        console.log("New Element to Add:", newElement);

        data.push(newElement);
    
        await fs.writeFile("jsons/meals.json", JSON.stringify(data, null, 2));
    
        res.status(201).json(data);
      } catch (error) {
        console.log("JSON ARRAY Error:", error.message);
        res.status(500).send({ message: error.message });
      }
    });
    
    app.put("/meals/:id", async (req, res) => {
      try {

        const jsonarray = await fs.readFile("jsons/meals.json", 'utf-8'); 
        let meals = JSON.parse(jsonarray);
        const { name, ingredients } = req.body;

        mealId=  req.params.id
        console.log("ID:", req.params.id);
        console.log("Name:", name);
        console.log("Ingredients (Raw):", ingredients);

        // Find the meal by ID
        const mealIndex = meals.findIndex(meal => meal.id == mealId);
        if (mealIndex === -1) {
          return res.status(404).json({ message: "Meal not found" });
        }

        // Update the meal
        meals[mealIndex] = { ...meals[mealIndex], name, ingredients };

        // Save back to file
        await fs.writeFile("jsons/meals.json", JSON.stringify(meals, null, 2));
        res.json(meals[mealIndex]);

      } catch (error) {
        console.log("JSON ARRAY Error:", error.message);
        res.status(500).send({ message: error.message });
      }
    });
  
app.get("/users", async (req,res) => {

try{
    const jsonarray = await readfile("jsons/users.json"); // Await it!
    res.status(201).json(jsonarray); // Send the actual data

}catch (error){
   // console.log("JSON ARRAY Error : "+ error)
   res.status(500).send({ 
     message: error
   })
}
})

app.post("/logout", (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  REFRESH_TOKENS.delete(refreshToken);
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
});

app.listen(PORT, () => console.log( `Listening on ${PORT}... `))
module.exports = app;

//Home.jsx

import axios from "axios";
import { useNavigate } from "react-router-dom";
import Meals from "./Meals";
import { useEffect, useState } from "react";

const Home = ({
  getEntry,
  setNewName,
  setIngredients,
  setMealId,
  deleteMeal,
  meals,
  setUsername,
  setPassword,
  setMeals,
}) => {
  const navigate = useNavigate();
  const API_URL = "http://localhost:3000";

  return (
    <>
      <button
        onClick={() => {
          navigate("/");
        }}
      >
        HOME
      </button>
      <button
        onClick={() => {
          let accessToken = localStorage.getItem("accessToken");
          console.log("accessToken: " + accessToken);
        }}
      >
        SHOW TOKEN!{" "}
      </button>
      <button
        onClick={() => {
          navigate("login");
        }}
      >
        LOGIN
      </button>

      <button
        onClick={async () => {
          const response = await axios.post(API_URL + "/logout");
          if (response != "") {
            localStorage.setItem("accessToken", "");
            // alert(response.message)

            setUsername("");
            setPassword("");
            setMeals("");
            navigate("/login");
          }
        }}
      >
        LOGOUT{" "}
      </button>

   
      <button
        onClick={() => {
          navigate("/create");
        }}
      >
        CREATE MEAL
      </button>

      <button
        onClick={ async () => {
            const refreshRes = await axios.post(
                "http://localhost:3000/refresh",
                {},
                { withCredentials: true }
              );
              localStorage.setItem("accessToken", refreshRes.data.accessToken);
        }}
      >
       REFRESH
      </button>



      <button
        onClick={() => {
          navigate("/meals");
        }}
      >
        SHOW MEALS
      </button>
    </>
  );
};

export default Home;
