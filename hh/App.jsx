import { useState, } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import SignIn from "./components/Signin"
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
const  getUsers = async () => {
  console.log("USERS")
   try{
    const response= await axios.get(API_URL+"/users")
    //console.log("RESPONSE: "+ response)
  
    for (let i=0; i<response.data.length; i++){
      console.log("Name: "+ response)
    }
    
    //alert("GETTING")
    
   } catch (error){
   }
 }
 




function App() {

  const [loggedIn, setLoggedIn] = useState(0)
  const [name, setName] = useState("")
  const [count, setCount] = useState(0)

  return (
    <>

     {loggedIn && (
      <>
     <button onClick={getEntry} >GET STATISTICS </button>
     <button onClick={getUsers} >GET USERS </button>
      </>
     )
     }

     {!loggedIn && (
      <SignIn
      setLoggedIn={(value) => { setLoggedIn(value)}} 

      setName  = {(value) => {setName(value);} }
      ></SignIn>
     )
     }

    </>
  )
}

export default App
