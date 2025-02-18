module.exports.isLogin = (req, res, next) =>{
    if(req.session.user){
        next();
    }else{
        res.send("Please Login");
    }
}