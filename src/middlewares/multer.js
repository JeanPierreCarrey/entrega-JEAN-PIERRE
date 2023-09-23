const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadFolder = '';

        if (file.fieldname === 'profileImage') {
            uploadFolder = 'uploads/profiles/';
        } else if (file.fieldname === 'productImage') {
            uploadFolder = 'uploads/products/';
        } else {
            uploadFolder = 'uploads/documents/';
        }

        cb(null, uploadFolder);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

module.exports = upload;