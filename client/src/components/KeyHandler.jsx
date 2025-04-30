import React from 'react'
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";



const KeyHandler = () => {
    const navigate = useNavigate();

    useEffect(() => {
      const handleShortcut = (event) => {
        if (event.key === "h") {
          event.preventDefault();
          navigate("/");
        } else if (event.key === "m") {
          event.preventDefault();
          navigate("/meals");
        }
      };
  
      window.addEventListener("keydown", handleShortcut);
      return () => window.removeEventListener("keydown", handleShortcut);
    }, [navigate]);
  
    return null; // no UI, just side effect
}

export default KeyHandler