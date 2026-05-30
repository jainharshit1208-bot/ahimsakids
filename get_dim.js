const fs = require('fs');
const Jimp = require('jimp');

async function processImage() {
    const imgPath = 'C:\\Users\\harsh\\.gemini\\antigravity\\brain\\1677608a-7948-44d6-ab65-55811960f775\\media__1780065244320.jpg';
    console.log("Loading image...");
    const image = await Jimp.read(imgPath);
    console.log(`Width: ${image.bitmap.width}, Height: ${image.bitmap.height}`);
}
processImage().catch(console.error);
