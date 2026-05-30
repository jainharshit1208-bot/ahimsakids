const fs = require('fs');

let html = fs.readFileSync('C:/Users/harsh/.gemini/antigravity/scratch/ahimsa-kids/index.html', 'utf8');

// Regex to find all tirthankara cards. 
// They start with either <div class="tirthankara-card" ... or <a href=... class="tirthankara-card" ...
// And end with </div> or </a>.
// Inside they have the badge with the number.
const cardRegex = /(?:<div|<a[^>]*)\s*class="tirthankara-card"[^>]*>\s*<div class="tirthankara-card__badge">(\d+)<\/div>\s*<div class="tirthankara-card__symbol"[^>]*>.*?<\/div>\s*<div class="tirthankara-card__name"[^>]*>.*?<\/div>\s*<div class="tirthankara-card__symbol-name"[^>]*>.*?<\/div>(?:\s*<div style="margin-top: 8px[^>]*>.*?<\/div>)?\s*<\/(?:div|a)>/g;

let count = 0;
html = html.replace(cardRegex, (match, numStr) => {
  count++;
  let num = parseInt(numStr);
  
  // Extract the inner HTML between the badge and symbol-name
  let innerMatch = match.match(/(<div class="tirthankara-card__badge">[\s\S]*?<div class="tirthankara-card__symbol-name"[^>]*>.*?<\/div>)/);
  if (!innerMatch) return match;
  
  let innerContent = innerMatch[1];
  
  // We want to force the youtube link specifically for index 1 as provided, and generic playlist for the rest.
  let url = 'https://www.youtube.com/watch?list=PL1VH4z91cJqMcHUb3_qT3hdC2Rqm9AnNC&index=' + num;
  if (num === 1) {
     url = 'https://youtu.be/POgXVqJPOuY?si=GdZNjTNLnYGxUAtq&list=PL1VH4z91cJqMcHUb3_qT3hdC2Rqm9AnNC&index=1';
  }
  
  return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="tirthankara-card" role="listitem" style="text-decoration: none; color: inherit;">
          ${innerContent}
          <div style="margin-top: 8px; font-size: 12px; color: var(--accent-pink); font-weight: bold;">▶️ Watch Story</div>
        </a>`;
});

console.log('Replaced', count, 'cards');
fs.writeFileSync('C:/Users/harsh/.gemini/antigravity/scratch/ahimsa-kids/index.html', html);
