const express = require("express");
const bodyParser = require('body-parser');
const router = require("./admin");
const showAccount = require('./../controllers/showAccount')
const createAccount = require('./../controllers/createAccount')
const updateAccount = require('./../controllers/updateAccount')
const deleteAccount = require('./../controllers/deleteAccount')

// -> Middlewares
router.use(bodyParser.json())
router.use(express.urlencoded({ extended: true }));
router.use(express.static("frontend"));

router.route("/login")
    .post(showAccount.single);

module.exports = router;