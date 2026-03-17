const user = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try
    {
        const {name ,email,password ,role}= req.body;

        const existinguser =await user.findOne ({email});
        if (existinguser){
            return res.status(400).json({message:"user already exsists "});
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const newuser = await user.create({name , email ,password:hashedPassword,role})

        const token =jwt.sign(
            {id: newuser._id, role : newuser.role },
            process.env.JWT_SECRET,
            {expiresIn: "7d"}
        );

        res.status(201).json({token, user : {name , email ,role}});
    }

    catch(error){
        res.status(500).json({message:error.message});

    }
}


const login = async(req, res) => {
try{
    const {email,password,role }= req.body;

    const foundUser= await user.findOne({email});
    if(!foundUser){
        return res.status(400).json({message: "invalid Credientials"});
    }

    const verifyPass=await bcrypt.compare(password,foundUser.password);
    if(!verifyPass){
        return res.status(400).json({message: "invalid Credentials "});

    }
    const token =jwt.sign(
            {id: foundUser._id ,role:foundUser.role},
            process.env.JWT_SECRET,
            {expiresIn: "7d"}
        );
    
    res.status(200).json({token, user :  {name :foundUser.name ,email:foundUser.email ,role: foundUser.role}});
    }catch(error){
        res.status(500).json({message:error.message});

    }
    
}

module.exports ={register ,login};