/* const multer = require("multer");
const path = require("path");
const {fileURLToPath} = require("url");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "public"));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

exports.uploader = multer({ storage });

const __filename = fileURLToPath(require("url").fileURLToPath(import.meta.url));
const __dirname = path.dirname(__filename);
exports.__filename = __filename;
exports.__dirname = __dirname; */