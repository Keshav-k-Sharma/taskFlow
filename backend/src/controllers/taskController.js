const task = require("../models/task");


const getAlltasks = async (req, res) => {
    try {
        const tasks = await task.find()
            .populate("assignedTo", "name email")
            .populate("project", "name");
        res.status(200).json(tasks);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const CreateTask= async (req,res) => {
    try
    {
        const {title ,description ,assignedTo ,deadline ,status } =req.body ;

        const newtask= await task.create({title ,description ,assignedTo ,deadline ,status , createdBy : req.user._id});

        res.status(201).json(newtask);


    }catch(error){
        return res.status(500).json({message:error.message});
    }

}

const UpdateStatus= async (req,res) => {
    try
    {
        const { id } = req.params;
        const{ status }= req.body;

        const updatedtask = await  task.findByIdAndUpdate(
            id,
            {status},
            {new :true}
        );

        if(!updatedtask){
            return res.status(404).json({message: "tasks not found "}); 
        }

        res.status(200).json(updatedtask);


    }catch(error){
        return res.status(500).json({message:error.message});
    }

}

module.exports = {CreateTask, UpdateStatus, getAlltasks};