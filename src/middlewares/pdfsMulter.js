const path = require('path');
const multer = require('multer');

// Multer
const fileStorageEngineConfig = multer.diskStorage({
    destination: function(req, file, cb) {
        let folder = '';
        folder = path.join(__dirname, '../../public/outputEditedPDFS');
        cb(null, folder);
    },
    filename: function(req, file, cb) {
        const filename = (file.originalname).split(".")[0];

        pdfName = filename + '-' + Date.now() + path.extname(file.originalname);
        cb(null, pdfName);
    }
});

let upload = multer({storage: fileStorageEngineConfig});

let multipleUpload = upload.any();

module.exports = multipleUpload;