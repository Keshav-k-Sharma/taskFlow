const mongoose =require('mongoose')

const taskSchema = new mongoose.Schema({
    title:{
        type : String ,
        required :true,
    },
    description:{
        type :String ,
        required : true 
    },
    assignedto :{
        type:mongoose.Schema.ObjectId,
        ref:'Member',
        required: true ,
    },
    status:{
        type: String ,
        required : true ,
    },


});

model.exports= mongoose.model('tasks',taskSchema);