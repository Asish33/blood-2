const express = require("express");
const router = express.Router();
const { registerRecipient } = require("../controllers/recipientController");

router.post("/", registerRecipient);

module.exports = router;

