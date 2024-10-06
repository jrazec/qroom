const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');

const getController = require("../controllers/getController");
const putController = require("../controllers/putController");
const postController = require("../controllers/postController");
const deleteController = require("../controllers/deleteController");

// -> Middlewares
router.use(bodyParser.json())
router.use(express.urlencoded({ extended: true }));
router.use(express.static("frontend"));

// Admin Login Page
router.route("/login")
    .get((req,res)=>{
        if(uname === "" || uname === undefined || pass === "" || pass === undefined  ){
            res.render('App.js');
        }else {
            if(uname === "admin" && pass == "12345"){
                res.redirect('App.js');
            }
        }
    });


module.exports = router;


