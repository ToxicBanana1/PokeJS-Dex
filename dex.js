import axios from 'https://cdn.skypack.dev/axios';
// import FormData from 'https://cdn.skypack.dev/form-data';

const imgbbApiKey = '6dc7d936f370b8d27e65c997d13db262';
const imagePath = 'search.png';
const expiration = 60;

async function uploadImage(image) {
    const form = new FormData();
    form.append('image', image);
    form.append('expiration', expiration);

    try {
        const response = await axios.post(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, form, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (response.data && response.data.data && response.data.data.url) {
            return `https://lens.google.com/uploadbyurl?url=${response.data.data.url}`;
        } else {
            throw new Error('Failed to upload image');
        }
    } catch (error) {
        console.error('Error uploading image:', error);
    }
}

const video = document.createElement('video');
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');

document.body.appendChild(video);
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
        video.play();
    })
    .catch(error => {
        console.error('Error accessing webcam:', error);
    });

// Set the video element to dynamically size to the screen
video.style.width = '100%';
video.style.height = '100%';
video.style.objectFit = 'cover';

video.addEventListener('click', async () => {
    // Adjust canvas size to match video size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    canvas.toBlob(async (blob) => {
        search(uploadImage(blob));
    }, 'image/png');
});

async function search(url) {
    try {
        const response = await axios.get(url);
        const pageContents = response.data;
        // Now you can search through pageContents
        console.log(pageContents);
    } catch (error) {
        console.error('Error fetching the webpage:', error);
    }
}