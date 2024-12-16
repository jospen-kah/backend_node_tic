const express = require('express');
const multer = require('multer');
const File = require('./fileSchema'); // Ensure fileSchema is correctly implemented and imported.

const file = express();
file.use(express.json());

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'loadedfiles/'); // Ensure this directory exists
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// File upload endpoint
file.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const { filename, path, mimetype, size } = req.file;

    try {
        const newFile = new File({ filename, path, mimetype, size });
        await newFile.save();

        res.status(200).json({
            message: 'New file uploaded successfully',
            file: newFile
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal Server Error',
            error: err.message
        });
    }
});

module.exports = file;