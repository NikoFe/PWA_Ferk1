import React from 'react'
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Protected = () => {
     const navigate = useNavigate()

    const [data, setData] = useState("");
    const [show, setShow] = useState(false);


    const fetchProtectedData = async () => {
        try {
            let accessToken = localStorage.getItem("accessToken");
           
            const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
            console.log(headers)
            const res = await axios.get("http://localhost:3000/protected", {
             headers 
            });
            setData(res.data.message);
        } catch (err) {
          {
                alert("access denied!")
                navigate("/")
                console.error(err);
            }
        }
    };

    useEffect(() => {
        fetchProtectedData();
    }, []);



  return (
     <>
     { show &&
     <div><h2>Protected Data:</h2><p>{data}</p></div>
    }
     </>
  )

}

export default Protected