// @ts-nocheck
const express = require("express");
const dotenv = require('dotenv');
const con = require("../config/db");
const app = express();
const cors = require("cors");
const bodyParser = require('body-parser'); // Parsing the req 

dotenv.config()

const PORT = process.env.PORT || 3001;


app.use(cors());
app.use(bodyParser.json())
app.get("/",(req,res)=>{
  res.send({s:"Hi"})
})
app.get("/api", (req, res) => {
  let queryUsers = `SELECT * FROM Users;`;
  
  // Execute the query
  con.query(queryUsers, (err, result) => {
      if (err) {
          console.error(err);
          res.status(500).json({ error: 'An error occurred while fetching data' });  // Send error response
      } else {
          res.status(201).json(result);     // Send the result as JSON response
      }
  });
});

app.post("/api/accounts",(req,res)=>{
  console.log(req.body.role)
  const addUsers = `INSERT INTO Users(user_name,first_name,middle_name,last_name,password,role)
                    VALUES(?,?,?,?,?,?);`;
  const userData = [`${req.body.userName}`,`${req.body.firstName}`,`${req.body.middleName}`,`${req.body.lastName}`,`${req.body.password}`,`${req.body.role}`];
  // Execute the query
  con.query(addUsers,userData, (err, result) => {
      if (err) {
          console.error(err);
          res.status(500).json({ error: 'An error occurred while fetching data' });  // Send error response
      } else {
          res.status(201).json({ message: "User added successfully", data: result });
      }
  });
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
});