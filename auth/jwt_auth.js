const jwt = require("jsonwebtoken")

exports.createToken = (user)=>{
    return jwt.sign(user, "abc")
}

exports.verifyToken = (req, res, next)=>{
    if(req.headers.cookie){
        const token = req.headers.cookie.split("=")[1]
        const decode = jwt.verify(token, "abc")
        req.all = decode
    }else{
        req.all = "token not found"
    }
    next();
}