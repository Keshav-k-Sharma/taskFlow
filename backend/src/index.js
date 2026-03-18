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

app.use(cors());
app.use(express.json());

const memberRoutes = require("./routes/memberRoutes");
const taskRoutes = require("./routes/taskRoutes");
const authroutes= require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");

app.use("/api/auth",authroutes);
app.use("/api/projects", projectRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});