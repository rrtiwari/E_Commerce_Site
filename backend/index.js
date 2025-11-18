require("dotenv").config(); // Load environment variables
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const mongoDB = require("./db");

// CORS Middleware
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    process.env.CLIENT_URL || "https://e-commerce-site-three-henna.vercel.app/"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, auth-token" // Added auth-token to allowed headers
  );
  next();
});

app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Delicious App Backend Running!");
});

app.use("/api/auth", require("./Routes/Auth"));

// Initialize DB and start server
const startServer = async () => {
  await mongoDB(); // Fetch data and connect
  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
};

startServer();
