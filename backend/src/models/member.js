const mongoose =require('mongoose');

const memberSchema = new mongoose.Schema({
    name :{
        type:String,
        required: true,
    },
    email:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        required : true,
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'user',
        required : true,
    },
})


module.exports= mongoose.model("Member",memberSchema);