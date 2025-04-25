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
