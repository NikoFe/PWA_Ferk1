const fs = require('fs').promises;

app.post("/meals", async (req, res) => {
  try {
    console.log("Incoming Body:", JSON.stringify(req.body, null, 2)); // Log incoming data

    // Read the file
    const jsonarray = await fs.readFile("jsons/meals.json", 'utf-8'); 
    console.log("Raw JSON String:", jsonarray);

    // Parse JSON string to an array
    let data = JSON.parse(jsonarray);

    // Extract the new meal from the body (assuming nested object)
    const newElement = req.body.newMeal || req.body;
    console.log("New Element to Add:", newElement);

    // Push the new element to the array
    data.push(newElement);

    // Write the updated array back to the file
    await fs.writeFile("jsons/meals.json", JSON.stringify(data, null, 2));

    // Respond with the updated data
    res.status(201).json(data);
    
  } catch (error) {
    console.log("JSON ARRAY Error:", error.message);
    res.status(500).send({ message: error.message });
  }
});
