const mongoose =require('mongoose');

const memberSchema = new mongoose.Schema({
    name :{
        type:String,
        required: true,
    },
    email:{
        type:String,
        required:true,
        unique: true,
    },
    position:{
        type:String,
        required : true,
    },
},{timestamps:true})


module.exports= mongoose.model("member",memberSchema);