const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports.authorization = (req, res, next) => {
    if(req.headers.authorization) {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            const decoded = jwt.verify(token, process.env.SECRET);
            req.user_id = decoded.user_id;
            req.token = token;
            next();

        } catch(err) {
            console.log(err);
            return res.status(404).json({message: "not Authorized!"});
        }
    }
}