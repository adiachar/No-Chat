const multer = require("multer");
const {CloudinaryStorage} = require("multer-storage-cloudinary");
const cloudinary = require("./CloudinaryConfig");

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "NoChat-ProfilePics",
        allowed_formats: ['jpg', 'png', 'jpeg'],
        transformation: [{width: 500, height: 500, crop: 'limit'}]
    }
});

const upload = multer({storage});
module.exports = upload;