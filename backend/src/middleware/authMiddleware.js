const jwt = require("jsonwebtoken");
const user = require("../models/user");

const protect = async (req , res,next ) => {
    try{
        const token = req.headers.authorization?.split(" ")[1];
        if(!token)
        {
            return res.status(401).json({message: "user not logged in "});
        }
        const decoded  = jwt.verify(token,process.env.JWT_SECRET);

        req.user= await user.findById(decoded.id).select("-password");
        next ();
    }catch(error){
        return res.status(500).json({message: error.message});

    }
    
}

const adminonly = async(req,res,next ) => {
    if(req.user.role==="admin"){
        next()
    }else{
        return res.status(403).json({message: "Access denied ,Admins Only "});
    }

}

module.exports={protect,adminonly};