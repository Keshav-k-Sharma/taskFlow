const mongoose= require("mongoose") ;

const userSchema =new mongoose.Schema({
    name: {
        type: String,
        required: true} ,
    email: {
        type: String,
        required: true,
    },
    password: {
        type: tring,
        required:true,  
    },
    role:{
        type: String,
        required: true,
        enum:['member', 'admin'],
        default: "member",
    }
}); 

model.exports =mongoose.model("user",userSchema);