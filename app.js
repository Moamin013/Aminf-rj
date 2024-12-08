const videoUpload = document.getElementById('video-upload');
const videoPlayer = document.getElementById('video-player');

function uploadVideo() {
    const file = videoUpload.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('video', file);

        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            videoPlayer.src = data.videoUrl; // Stel de bron van de speler in op de video-URL
        })
        .catch(error => console.error('Error uploading video:', error));
    }
}

function cutVideo() {
    // Functie om video te snijden (verbind met backend om met FFmpeg te werken)
    fetch('/cut-video', {
        method: 'POST',
        body: JSON.stringify({ start: 0, end: 30 }), // Snijd van 0s tot 30s
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        videoPlayer.src = data.videoUrl; // Update de video na het snijden
    })
    .catch(error => console.error('Error cutting video:', error));
}

function addTextToVideo() {
    // Functie om tekst aan de video toe te voegen
    fetch('/add-text', {
        method: 'POST',
        body: JSON.stringify({ text: 'Mijn tekst' }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        videoPlayer.src = data.videoUrl; // Update de video na het toevoegen van tekst
    })
    .catch(error => console.error('Error adding text to video:', error));
}

function downloadVideo() {
    const videoUrl = videoPlayer.src;
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = 'video-bewerkt.mp4';
    a.click();
}
