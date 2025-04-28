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

      <button
    
        onClick={() => {
          console.log("SHOW CACHE")
          console.log("____________________________________________________________________")
          let i=1
          let createString="create"+i;
        while(localStorage.getItem(createString)!=""  && localStorage.getItem(createString)){
        console.log("~~~~~~~~~~~~~",createString,"~~~~~~~~~~~~~" )
        console.log("^^^^^^^",JSON.stringify(localStorage.getItem(createString)),"^^^^^^^")
        i++;
        createString="create"+i;
        }
        i=1
        let updateString="update"+i;
        while(localStorage.getItem(updateString)!=""  && localStorage.getItem(updateString)){
        console.log("~~~~~~~~~~~~~",updateString,"~~~~~~~~~~~~~" )
        console.log("^^^^^^^",JSON.stringify(localStorage.getItem(updateString)),"^^^^^^^")
        i++;
        updateString="update"+i;
        }
        i=1
        let deleteString="delete"+i;
        while(localStorage.getItem(deleteString)!=""  && localStorage.getItem(deleteString)){
        console.log("~~~~~~~~~~~~~",deleteString,"~~~~~~~~~~~~~" )
        console.log("^^^^^^^",JSON.stringify(localStorage.getItem(deleteString)),"^^^^^^^")
        i++;
        deleteString="update"+i;

      }
      //localStorage.clear()
      console.log("____________________________________________________________________")
      }}
      >
        SHOW CACHE
      </button>


      <button
        onClick={() => {
        console.log("DELETE CACHE")
         localStorage.clear()
        }}
      >
        DELETE CACHE
      </button>




    </>
  );
};

export default Home;
