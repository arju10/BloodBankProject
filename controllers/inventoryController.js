const mongoose = require("mongoose");
const inventoryModel = require("../models/inventoryModel");
const userModel = require("../models/userModel");

// CREATE INVENTORY => ("/api/v1/inventory/create-inventory") [POST]
const createInventoryController = async (req, res) => {
    try {
      const { email } = req.body;
      //validation
      const user = await userModel.findOne({ email });
      if (!user) {
        throw new Error("User Not Found");
      }
      // if (inventoryType === "in" && user.role !== "donar") {
      //   throw new Error("Not a donar account");
      // }
      // if (inventoryType === "out" && user.role !== "hospital") {
      //   throw new Error("Not a hospital");
      // }
  
      if (req.body.inventoryType == "out") {
        const requestedBloodGroup = req.body.bloodGroup;
        const requestedQuantityOfBlood = req.body.quantity;
        // const organization = mongoose.Types.ObjectId(req.body.organization);
        const organization = new mongoose.Types.ObjectId(req.body.userId);


        //calculate Blood Quantity
        const totalInOfRequestedBlood = await inventoryModel.aggregate([
          {
            $match: {
              organization,
              inventoryType: "in",
              bloodGroup: requestedBloodGroup,
            },
          },
          {
            $group: {
              _id: "$bloodGroup",
              total: { $sum: "$quantity" },
            },
          },
        ]);
        // console.log("Total In", totalInOfRequestedBlood);
        const totalIn = totalInOfRequestedBlood[0]?.total || 0;
        //calculate OUT Blood Quantity
  
        const totalOutOfRequestedBloodGroup = await inventoryModel.aggregate([
          {
            $match: {
              organization,
              inventoryType: "out",
              bloodGroup: requestedBloodGroup,
            },
          },
          {
            $group: {
              _id: "$bloodGroup",
              total: { $sum: "$quantity" },
            },
          },
        ]);
        const totalOut = totalOutOfRequestedBloodGroup[0]?.total || 0;
  
        //in & Out Calc
        const availableQuantityOfBloodGroup = totalIn - totalOut;
        //quantity validation
        if (availableQuantityOfBloodGroup < requestedQuantityOfBlood) {
          return res.status(500).send({
            success: false,
            message: `Only ${availableQuantityOfBloodGroup}ML of ${requestedBloodGroup.toUpperCase()} is available`,
          });
        }
        req.body.hospital = user?._id;
      } else {
        req.body.donar = user?._id;
      }
  
      //save record
      const inventory = new inventoryModel(req.body);
      await inventory.save();
      return res.status(201).send({
        success: true,
        message: "New Blood Record Added",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "Error In Create Inventory API",
        error,
      });
    }
  };
  
  // GET ALL BLOOD RECORDS => ("/api/v1/inventory/get-inventory") [GET]
const getInventoryController = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find({
        organization: req.body.userId,
      })
      .populate("donar")
      .populate("hospital")
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      message: "get all records successfully",
      inventory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Get All Inventory",
      error,
    });
  }
};
  module.exports = {
    createInventoryController,
    getInventoryController
  };