import React, { useEffect, useState } from "react";

const SignIn = ({setLoggedIn, setName }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");


  const validate = () => {
    if (username != "" && password != "") {
      console.log("USERNAME: " + username + " PASSWORD: " + password);

      setName(username);

      setLoggedIn(true);
    }
    return;
  };

  return (
    <div className="signin_div">
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
