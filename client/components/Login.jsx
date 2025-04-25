import { useState, } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from "axios"

//const API_URL="h"
 const API_URL = "http://localhost:5000/"


 const  getEntry = async () => {
 console.log("GETTING")
  try{
   const response= await axios.get(API_URL+"/statistics")
   console.log("RESPONSE: "+ response)
   //alert("GETTING")
   

  } catch (error){
    
  }

}



function Login() {
  const [count, setCount] = useState(0)

  return (
    <>
     <button onClick={getEntry} >GET </button>



    </>
  )
}

export default App
