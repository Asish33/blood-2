const Recipient = require("../models/recipientModel");

const registerRecipient = async (req, res) => {
  try {
    const recipient = new Recipient(req.body);
    await recipient.save();
    
    // Change status code to 201 (Created) for successful resource creation
    res.status(201).json({ message: "Recipient registered successfully" });
  } catch (error) {
    console.error("Recipient registration error:", error);
    res.status(500).json({ message: "Recipient registration failed", error });
  }
};

module.exports = { registerRecipient };