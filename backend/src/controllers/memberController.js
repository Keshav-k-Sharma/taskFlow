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
        const {name ,email ,position } =req.body;

        const newMember = await member.create({name ,email ,position});
         res.status(201).json(newMember);


    }catch(error){
        res.status(500).json({message:error.message});
    }
}

const updateMember = async (req, res) => {
    try {
        const { id } = req.params;
        const { position } = req.body;
        const updated = await Member.findByIdAndUpdate(
            id,
            { position },
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: "Member not found" });
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports ={ getAllmembers ,CreateMember, updateMember}