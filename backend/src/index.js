const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

require("./models/user");
require("./models/member");
require("./models/task");
require("./models/project");

connectDB();

const app = express();

const allowedOrigins = [
  "https://task-flow-gmi4.vercel.app", 
  "http://localhost:3000"                  
];

app.use(cors({
  origin: function (origin, callback) {
    
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS policy violation'), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

const memberRoutes = require("./routes/memberRoutes");
const taskRoutes = require("./routes/taskRoutes");
const authroutes= require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");

app.use("/api/auth",authroutes);
app.use("/api/projects", projectRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/health", (req, res) => {
    res.status(200).json({ status: "UP" });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports =app;