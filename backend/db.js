const mongoose = require("mongoose");

const mongoDB = async () => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log("Connected to MongoDB Successfully");

    const fetched_data = await mongoose.connection.db.collection("foods");
    const data = await fetched_data.find({}).toArray();

    const foodCategory = await mongoose.connection.db.collection("foods_app");
    const catData = await foodCategory.find({}).toArray();

    // Set global variables
    global.foodData = data;
    global.foodCategory = catData;

  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1); 
  }
};

module.exports = mongoDB;
