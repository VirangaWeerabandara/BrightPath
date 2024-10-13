require('dotenv').config();

var cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: 'dvke6mrfk', 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const opts = {
    overwrite: true,
    invalidate: true,
    resource_type: "auto"
}

module.exports = (image) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(image, opts, (err, url) => {
            if (url && url.secure_url) {
                console.log(url.secure_url);
                return resolve(url.secure_url);
            } else {
                console.log(err.message);
                return reject({message: err.message});
            }
        })
    })
}