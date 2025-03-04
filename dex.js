import axios from 'https://cdn.skypack.dev/axios';
import FormData from 'https://cdn.skypack.dev/form-data';

const imgbbApiKey = '6dc7d936f370b8d27e65c997d13db262';
const imagePath = 'search.png';
const expiration = 60;

async function uploadImage() {
    try {
        const form = new FormData();
        form.append('image', fs.createReadStream(imagePath));
        form.append('expiration', expiration);

        const response = await axios.post(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, form, {
            headers: form.getHeaders(),
        });

        if (response.data && response.data.data && response.data.data.url) {
            console.log('Image URL:', response.data.data.url);
            return response.data.data.url;
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
const captureButton = document.createElement('button');
captureButton.innerText = 'Capture Image';

document.body.appendChild(video);
document.body.appendChild(captureButton);

navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
        video.play();
    })
    .catch(error => {
        console.error('Error accessing webcam:', error);
    });

captureButton.addEventListener('click', () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(async (blob) => {
        const form = new FormData();
        form.append('image', blob);
        form.append('expiration', expiration);

        try {
            const response = await axios.post(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, form, {
                headers: form.getHeaders(),
            });

            if (response.data && response.data.data && response.data.data.url) {
                console.log('Image URL:', response.data.data.url);
            } else {
                throw new Error('Failed to upload image');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    }, 'image/png');
});