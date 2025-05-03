const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require("cors");
const jwt = require("jsonwebtoken");
const webpush = require("web-push");
const bodyParser = require("body-parser");
require("dotenv").config();
const fs2 = require("fs");

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
app.use(bodyParser.json());


const PORT = 3000;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//**************************************//
/*
app.use((req, res, next) => {
  console.log("CURRENTLY BEING USED: ",path.join(__dirname, '../public', 'index.html') )
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});
*/
//**************************************//


//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
const VAPID_KEYS = webpush.generateVAPIDKeys();

webpush.setVapidDetails(
  "mailto:niko.ferk@student.com",
  VAPID_KEYS.publicKey,
  VAPID_KEYS.privateKey
);

// Store subscriptions
const SUB_FILE = "./subscriptions.json";

// Read subscriptions
const readSubscriptions = () => {
  if (!fs2.existsSync(SUB_FILE)) {
    console.log("File does not exist, returning empty array.");
    return [];
  }

  try {
    const content = fs2.readFileSync(SUB_FILE, "utf-8");
    if (!content.trim()) {
      // File is empty or whitespace
      return [];
    }
    return JSON.parse(content);
  } catch (err) {
    console.error("Failed to read subscriptions:", err);
    return [];
  }
};

// Save subscriptions
const saveSubscriptions = (subs) => {
  fs2.writeFileSync(SUB_FILE, JSON.stringify(subs, null, 2));
};

// Subscribe route
app.post("/subscribe", (req, res) => {
  console.log("A")
  const subs = readSubscriptions();
  const newSub = req.body;
  console.log("B")
  console.log("newSub: ",newSub)
  // Avoid duplicates
  if (!subs.find(s => s.endpoint === newSub.endpoint)) {
    console.log("sub denied!")
    subs.push(newSub);
    saveSubscriptions(subs);
  }

  res.status(201).json({ message: "Subscribed" });
});

// Trigger notification
app.post("/notify", async (req, res) => {
  const subs = readSubscriptions();
  const payload = JSON.stringify({ title: "Push Test 222", body: "Hello from server222!" });

  for (let sub of subs) {
    try {
      await webpush.sendNotification(sub, payload);
    } catch (err) {
      console.error("Push Error", err);
    }
  }

  res.status(200).json({ message: "Notifications sent" });
});

// Trigger notification
app.post("/notifyCreate", async (req, res) => {
  const subs = readSubscriptions();
  const payload = JSON.stringify({ title: "SUCCESS!", body: "Meal successfuly created!" });

  for (let sub of subs) {
    try {
      await webpush.sendNotification(sub, payload);
    } catch (err) {
      console.error("Push Error", err);
    }
  }

  res.status(200).json({ message: "Notifications sent" });
});
app.post("/notifyError", async (req, res) => {
  const subs = readSubscriptions();
  const payload = JSON.stringify({ title: "ERROR!", body: "Error creating!" });

  for (let sub of subs) {
    try {
      await webpush.sendNotification(sub, payload);
    } catch (err) {
      console.error("Push Error", err);
    }
  }

  res.status(200).json({ message: "Notifications sent" });
});






// Send VAPID key
app.get("/vapidPublicKey", (req, res) => {
  res.send(VAPID_KEYS.publicKey);
});
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
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
  //console.log("USERNAME PASSWORD: "+username+" "+password)
  //console.log("SIGNED !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1")
  const accessToken = jwt.sign({ username: username, password:password }, SECRET_KEY, { expiresIn: "10m" });
  //SECRET_KEY="Bearer "+accessToken
  //console.log("SECRET KEY: ",SECRET_KEY )
  const refreshToken = jwt.sign({ username: username, password:password }, REFRESH_SECRET, { expiresIn: "7d" });
  REFRESH_TOKENS.add(refreshToken);
  return { accessToken, refreshToken };
};

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const { accessToken, refreshToken } = generateTokens(username,password);
  res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });

  res.json({ accessToken });
});


app.get("/protected", (req, res) => {
  const authHeader = req.headers.authorization;

  /*
  if (!authHeader) return res.status(401).json({ error: "Token required" });

  const token = authHeader.split(" ")[1];

  jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) return res.status(403).json({ error: "Invalid token" });
      res.json({ message: "Sensitive data", user });
  });*/
});

app.get("/meals", async (req,res) => {
  try{
  const authHeader = req.headers.authorization;
  //const token = authHeader.split(" ")[1] && authHeader;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token ) return res.status(401).json({ error: "Token required" });
  
  console.log("GET MEAL TOKEN: |",token,"|")
  console.log("SECRET KEY: |", SECRET_KEY,"|")

  jwt.verify(token, SECRET_KEY, async (err,user) => {
      if (err) return res.status(403).json({ error: "Invalid token" });
      const jsonarray =  await readfile("./jsons/meals.json"); // Await it!
      return res.status(201).json( { array:jsonarray  }  ); // Send the actual data

    });
  }
    catch(error){
      console.error("GET MEALS ERROR:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  })

  app.get("/meals/:id", async (req,res) => {
    try{
      mealId=  req.params.id
      res.status(201).json(mealId);
    }
      catch(error){
        console.error("GET SINGLE MEAL ERROR:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    })
  
  app.post("/meals", async (req, res) => {
    try {
      console.log("Incoming Body:", JSON.stringify(req.body, null, 2)); // Log incoming data
  
      const jsonarray = await fs.readFile("./jsons/meals.json", 'utf-8'); 
      console.log("Raw JSON String:", jsonarray);
  
      let data = JSON.parse(jsonarray);
  
      const newElement = req.body.newMeal || req.body;
      console.log("New Element to Add:", newElement);
  
      data.push(newElement);
  
      await fs.writeFile("./jsons/meals.json", JSON.stringify(data, null, 2));
  
      res.status(201).json(data);
    } catch (error) {
      console.log("JSON ARRAY Error:", error.message);
      res.status(500).send({ message: error.message });
    }
  });
  
  app.put("/meals/:id", async (req, res) => {
    try {
      console.log("PUTPUT")
      const jsonarray = await fs.readFile("./jsons/meals.json", 'utf-8'); 
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

app.post("/refresh", (req, res) => {
  try{
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
}
catch(error){
  console.error("REFRESH ERROR:", error);
  return res.status(500).json({ error: "Internal server error" });
}
});

app.get("/statistics", (req,res) => {
res.status(200).send({
 message: "SUCCESS"
}
)
})

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

