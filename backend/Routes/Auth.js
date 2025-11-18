const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Order = require("../models/Orders");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const fetch = require("../middleware/fetchdetails"); // Ensure path matches your folder structure

// 1. Create User
router.post(
  "/createuser",
  [
    body("email").isEmail(),
    body("password", "Password must be at least 5 characters").isLength({
      min: 5,
    }),
    body("name").isLength({ min: 3 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const salt = await bcrypt.genSalt(10);
      const securePassword = await bcrypt.hash(req.body.password, salt);

      const user = await User.create({
        name: req.body.name,
        password: securePassword,
        email: req.body.email,
        location: req.body.location,
      });

      const data = { user: { id: user.id } };
      const authToken = jwt.sign(data, process.env.JWT_SECRET);

      res.json({ success: true, authToken });
    } catch (error) {
      console.error(error.message);
      res.json({
        success: false,
        error: "User already exists or server error.",
      });
    }
  }
);

// 2. Login User
router.post(
  "/login",
  [
    body("email", "Enter a Valid Email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ success: false, error: "Invalid Credentials" });
      }

      const pwdCompare = await bcrypt.compare(password, user.password);
      if (!pwdCompare) {
        return res
          .status(400)
          .json({ success: false, error: "Invalid Credentials" });
      }

      const data = { user: { id: user.id } };
      const authToken = jwt.sign(data, process.env.JWT_SECRET);

      res.json({ success: true, authToken });
    } catch (error) {
      console.error(error.message);
      res.send("Server Error");
    }
  }
);

// 3. Get User Details
router.post("/getuser", fetch, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.send("Server Error");
  }
});

// 4. Get Location (Geocoding)
router.post("/getlocation", async (req, res) => {
  try {
    const { lat, long } = req.body.latlong;
    const apiKey = process.env.OPENCAGE_API_KEY;

    const response = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${long}&key=${apiKey}`
    );

    const components = response.data.results[0].components;
    const { village, county, state_district, state, postcode } = components;

    // Construct location string safely (handling undefined values)
    const locationStr = [village, county, state_district, state, postcode]
      .filter(Boolean) // Removes undefined/null
      .join(", ");

    res.send({ location: locationStr });
  } catch (error) {
    console.error(error.message);
    res.send("Server Error");
  }
});

// 5. Get Food Data
router.post("/foodData", (req, res) => {
  try {
    res.send([global.foodData, global.foodCategory]);
  } catch (error) {
    console.error(error.message);
    res.send("Server Error");
  }
});

// 6. Save/Update Order Data
router.post("/orderData", async (req, res) => {
  let data = req.body.order_data;

  // Add Order Date to the beginning of the data array
  data.splice(0, 0, { Order_date: req.body.order_date });

  try {
    // Logic Simplified: 'upsert: true' creates the document if it doesn't exist
    await Order.findOneAndUpdate(
      { email: req.body.email },
      { $push: { order_data: data } },
      { upsert: true, new: true }
    );

    res.json({ success: true });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error: " + error.message);
  }
});

// 7. Get My Orders
router.post("/myOrderData", async (req, res) => {
  try {
    let myData = await Order.findOne({ email: req.body.email });
    res.json({ orderData: myData });
  } catch (error) {
    res.send("Server Error: " + error.message);
  }
});

module.exports = router;
