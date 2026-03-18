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
    assignedTo :{
        type:mongoose.Schema.Types.ObjectId,
        ref:'member',
        required: true ,
    },
    status:{
        type: String ,
        enum:["pending","completed"],
        default :"pending",
        required : true ,
    },
    createdBy:{
        required:true ,
        type :mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    deadline:{
        type:Date,
    },
    project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    }


},{timestamps: true });

module.exports= mongoose.model('tasks',taskSchema);