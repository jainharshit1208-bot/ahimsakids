const fs = require('fs');
let c = fs.readFileSync('C:/Users/harsh/.gemini/antigravity/brain/973f09df-0ab8-42f4-b096-4a2c8139e34e/.system_generated/steps/1089/content.md', 'utf8');
let m = c.match(/\/watch\?v=[A-Za-z0-9_-]+(?:\\u0026|&amp;|&)list=PL1VH4z91cJqMcHUb3_qT3hdC2Rqm9AnNC(?:\\u0026|&amp;|&)index=\d+/g);
if (m) {
  let s = new Set();
  m.forEach(x => {
    let clean = x.replace(/\\u0026/g, '&').replace(/&amp;/g, '&');
    s.add('https://www.youtube.com' + clean);
  });
  console.log(Array.from(s).slice(0, 24).join('\n'));
} else {
  console.log('no match');
}
