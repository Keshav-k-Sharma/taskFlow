const member = require("../models/member");

const getAllmembers = async(req,res) => {
    try
    {
        const members =await  member.find().populate("user","-password");
        if(!members){
            return res.status(404).json({message: "no members found "});
        }
        res.status(200).json(members);


    }catch(error){
        res.status(500).json({message:error.message});
    }
}


const CreateMember =  async(req,res) => {
    try
    {
        const {name ,email ,role } =req.body;

        const newMember = await member.create({name ,email ,role ,user : req.user._id});
         res.status(201).json(newMember);


    }catch(error){
        res.status(500).json({message:error.message});
    }
}

module.exports ={ getAllmembers ,CreateMember};