const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { createInventoryController, getInventoryController} = require("../controllers/inventoryController");



const router = express.Router();

//routes
// ADD INVENTORY || POST
router.post("/create-inventory",authMiddleware, createInventoryController);
router.get("/get-inventory",getInventoryController);

module.exports = router;