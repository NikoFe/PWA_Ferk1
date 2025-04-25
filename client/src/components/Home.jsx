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
