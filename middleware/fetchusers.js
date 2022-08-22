var jwt = require("jsonwebtoken");
const JWT_SECRET = "qwertyuiop";

const fetchuser=(req,res,next)=>{
    //get student from the jwt token and add to req object
    const token=req.header('auth-token');
    if(!token){
        res.status(401).send({error:"please authenticate using a valid token"})

    }
    try {
        
        const data = jwt.verify(token, JWT_SECRET);
        req.student=data.user;
        next();
    } catch (error) {
        res.status(401).send({error:"please authenticate using a valid token"})
        
    }
}



module.exports=fetchuser