const { Jimp } = require('jimp');

async function processImage(inputPath, outputPath) {
  try {
    const img = await Jimp.read(inputPath);
    
    img.scan((x, y, idx) => {
      const r = img.bitmap.data[idx];
      const g = img.bitmap.data[idx + 1];
      const b = img.bitmap.data[idx + 2];
      
      if (r > 240 && g > 240 && b > 240) {
        img.bitmap.data[idx + 3] = 0;
      }
    });

    await img.write(outputPath);
    console.log(`Successfully processed ${outputPath}`);
  } catch (err) {
    console.error(`Failed to process ${inputPath}:`, err);
  }
}

const files = [
  { in: 'C:\\Users\\harsh\\.gemini\\antigravity\\brain\\973f09df-0ab8-42f4-b096-4a2c8139e34e\\slide4_isolated_1779559488859.png', out: 'assets/slide4.png' }
];

async function run() {
  for (const f of files) {
    await processImage(f.in, f.out);
  }
}

run();
