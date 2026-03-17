const mongoose =require("mongoose");

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