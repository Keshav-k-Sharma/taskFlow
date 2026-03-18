const mongoose =require("mongoose");

const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("connect to database successfully")
    }catch(error){
        console.error("Database not connected",error.message);
        process.exit(1)
    }
}

module.exports= connectDB;