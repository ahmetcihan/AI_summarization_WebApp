const express = require('express');
const cors = require('cors');
const multer = require('multer');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Multer yapılandırması
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed!'), false);
    }
  }
});

// Test endpoint’i
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to AI Summarization Backend!' });
});

// Audio upload endpoint’i
app.post('/upload', upload.single('audio'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No audio file uploaded' });
  }
  res.json({ message: 'Audio file uploaded successfully', filename: req.file.filename });
});

// Dummy transkripsiyon endpoint’i
app.post('/transcribe', (req, res) => {
  const { filename } = req.body;
  if (!filename) {
    return res.status(400).json({ error: 'Filename is required' });
  }
  res.json({ transcription: 'This is a dummy transcription for ' + filename });
});

// Dummy özetleme endpoint’i
app.post('/summarize', (req, res) => {
  const { transcription } = req.body;
  if (!transcription) {
    return res.status(400).json({ error: 'Transcription is required' });
  }
  res.json({ summary: 'This is a dummy summary of: ' + transcription });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});