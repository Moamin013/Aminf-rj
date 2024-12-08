const express = require('express');
const multer = require('multer');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

const app = express();
const port = 3000;

// Configure multer voor bestand uploaden
const upload = multer({ dest: 'uploads/' });

// Middleware voor JSON parsing
app.use(express.json());

// Route voor het uploaden van video's
app.post('/upload', upload.single('video'), (req, res) => {
    const videoPath = path.join(__dirname, req.file.path);
    res.json({ videoUrl: `/uploads/${req.file.filename}` });
});

// Route voor het snijden van een video
app.post('/cut-video', (req, res) => {
    const { start, end } = req.body;
    const inputPath = path.join(__dirname, 'uploads', 'input-video.mp4');
    const outputPath = path.join(__dirname, 'uploads', 'output-video.mp4');

    ffmpeg(inputPath)
        .setStartTime(start)
        .setDuration(end - start)
        .output(outputPath)
        .on('end', () => {
            res.json({ videoUrl: `/uploads/output-video.mp4` });
        })
        .run();
});

// Route voor het toevoegen van tekst aan een video
app.post('/add-text', (req, res) => {
    const { text } = req.body;
    const inputPath = path.join(__dirname, 'uploads', 'input-video.mp4');
    const outputPath = path.join(__dirname, 'uploads', 'output-text-video.mp4');

    ffmpeg(inputPath)
        .outputOptions('-vf', `drawtext=text='${text}':x=10:y=10:fontsize=24:fontcolor=white`)
        .output(outputPath)
        .on('end', () => {
            res.json({ videoUrl: `/uploads/output-text-video.mp4` });
        })
        .run();
});

// Server voor het bedienen van uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start de server
app.listen(port, () => {
    console.log(`Server draait op http://localhost:${port}`);
});
