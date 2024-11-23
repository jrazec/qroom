const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');
const showAccount = require('./../controllers/showAccount')
const createAccount = require('./../controllers/createAccount')
const updateAccount = require('./../controllers/updateAccount')
const deleteAccount = require('./../controllers/deleteAccount')
const showRoom = require("./../controllers/showRoom")
const updateDocument = require("./../controllers/updateDocument");
// -> Middlewares
router.use(bodyParser.json())
router.use(express.urlencoded({ extended: true }));
router.use(express.static("frontend"));

// Admin Login Page
router
    .route("/accounts")
    .get(showAccount.all)
    .post(createAccount.single)
    .put(updateAccount.single)
    .delete(deleteAccount.single);

router.route("/rooms").get(showRoom.labAndClass)
router.route("/update-document").post(updateDocument.single)

module.exports = router;



