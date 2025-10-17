const express = require('express');
const multer = require('multer');
const cors = require('cors');
const axios = require('axios');
const FormData = require('form-data');

const app = express();
const port = process.env.PORT || 3000;

// Use multer for memory storage (to handle the incoming file)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Enable CORS for all routes
app.use(cors());

// Define the upload endpoint
app.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    try {
        // Create a new FormData instance to forward the file to file.io
        const form = new FormData();
        form.append('file', req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
        });

        // Make the request to file.io from our server
        const response = await axios.post('https://file.io', form, {
            headers: {
                ...form.getHeaders(),
            },
        });

        // Send file.io's response back to our frontend
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error forwarding to file.io:', error.message);
        res.status(500).json({ success: false, message: 'Server failed to upload file.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
