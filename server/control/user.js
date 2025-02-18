const User = require("../model/user.js");

let secretKey = "Super&secret%$";

module.exports.userSignUp = async (req, res) =>{
    const userData = req.body.values;
    let newUser = {
        userName: userData.userName,
        dob: userData.dob,
        email: userData.email,
        password: userData.password,
    };
    try{
        newUser = new User(newUser);
        await newUser.save();
        let userObject = newUser.toObject();
        let user = {_id: userObject._id, userName: userObject.userName, email: userObject.email};
        res.json({user});
    }catch(err){
        console.log("error in control/user.js:", err);
    };  
}

module.exports.userSignIn = async (req, res) =>{
    User.findOne({email: req.body.email}, "_id userName email password").lean()
    .then((user) => {
        if (user) {
            if (user.password == req.body.password) {
                delete user.password;
                req.session.user = user;
                res.send({user});
            } else {
                res.send("Incorrect Password");
            }
        } else {
            res.json("User Not Found!");
        }
    });
}

module.exports.validateSession = (req, res) =>{
    if(req.session.user){
        res.send({valid: true, user: req.session.user});
    }else{
        res.json({valid: false});
    }
}
