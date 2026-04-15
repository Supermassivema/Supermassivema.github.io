const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const WORK = path.join(ROOT, 'assets/images/work');

// Current filename → new filename mapping
const renames = [];

function plan(folder, oldName, newName) {
  const oldPath = path.join(WORK, folder, oldName);
  const newPath = path.join(WORK, folder, newName);
  if (oldName === newName) return;
  if (!fs.existsSync(oldPath)) return;
  renames.push({
    from: oldPath,
    to: newPath,
    oldRef: `/assets/images/work/${folder}/${oldName}`,
    newRef: `/assets/images/work/${folder}/${newName}`,
    folder, oldName, newName
  });
}

// ─── Geum Sahong: English translation → romanized Korean + year ───
const geumMap = {
  'geum-sahong-tiger-and-magpie-no0789.jpg': 'geum-sahong-hojakdo-no0789-2026.jpg',
  'geum-sahong-tiger-and-magpie-no0791.jpg': 'geum-sahong-hojakdo-no0791-2026.jpg',
  'geum-sahong-tiger-and-magpie-no0797.jpg': 'geum-sahong-hojakdo-no0797-2026.jpg',
  'geum-sahong-tiger-and-magpie-no0799.jpg': 'geum-sahong-hojakdo-no0799-2026.jpg',
  'geum-sahong-tiger-and-magpie-no0800.jpg': 'geum-sahong-hojakdo-no0800-2026.jpg',
  'geum-sahong-tiger-and-magpie-no0801.jpg': 'geum-sahong-hojakdo-no0801-2026.jpg',
  'geum-sahong-tiger-and-magpie-no0802.jpg': 'geum-sahong-hojakdo-no0802-2026.jpg',
  'geum-sahong-tiger-and-magpie-no0803.jpg': 'geum-sahong-hojakdo-no0803-2026.jpg',
  'geum-sahong-tiger-and-magpie-no0811.jpg': 'geum-sahong-hojakdo-no0811-2026.jpg',
  'geum-sahong-tiger-and-magpie-no0812.jpg': 'geum-sahong-hojakdo-no0812-2026.jpg',
  'geum-sahong-tiger-and-magpie-no0813.jpg': 'geum-sahong-hojakdo-no0813-2026.jpg',
  'geum-sahong-prosperity-no0804.jpg': 'geum-sahong-bugwi-no0804-2026.jpg',
  'geum-sahong-ascension-no0805.jpg': 'geum-sahong-ibsin-no0805-2026.jpg',
  'geum-sahong-resurrection-no0806.jpg': 'geum-sahong-buhwal-no0806-2026.jpg',
  'geum-sahong-hope-no0807.jpg': 'geum-sahong-huimang-no0807-2026.jpg',
  'geum-sahong-abundance-no0808.jpg': 'geum-sahong-pungyo-no0808-2026.jpg',
  'geum-sahong-humility-no0809.jpg': 'geum-sahong-gyeomheo-no0809-2026.jpg',
  'geum-sahong-harmony-no0810.jpg': 'geum-sahong-hwamog-no0810-2026.jpg',
  'geum-sahong-love-birds-no0815.jpg': 'geum-sahong-yeonmodo-no0815-2026.jpg',
  'geum-sahong-love-birds-no0816.jpg': 'geum-sahong-yeonmodo-no0816-2026.jpg',
  'geum-sahong-irworobongdo-no0816.jpg': 'geum-sahong-ilwolobongdo-no0816-2026.jpg',
  'geum-sahong-peony-no0817.jpg': 'geum-sahong-morando-no0817-2026.jpg'
};
for (const [o, n] of Object.entries(geumMap)) plan('Geum Sahong', o, n);

// ─── Cho Chang-hwan: work-NNN → soom-breath-NN ───
// Available artworks (ordered)
const choFiles = fs.readdirSync(path.join(WORK, '조창환 작가'))
  .filter(f => /^cho-chang-hwan-work-\d+/.test(f))
  .sort();
choFiles.forEach((f, i) => {
  const ext = f.match(/\.(jpg|jpeg|png)$/i)[0].toLowerCase();
  const newName = `cho-chang-hwan-soom-breath-${String(i+1).padStart(2,'0')}${ext}`;
  plan('조창환 작가', f, newName);
});

// ─── Cho Chang-hwan exhibition views (전시전경 folder) ───
const choExhFolder = path.join(WORK, '조창환 작가/전시전경');
if (fs.existsSync(choExhFolder)) {
  const exhFiles = fs.readdirSync(choExhFolder).filter(f => /\.(jpg|jpeg|png)$/i.test(f)).sort();
  exhFiles.forEach((f, i) => {
    if (f.startsWith('KakaoTalk_')) {
      const ext = f.match(/\.(jpg|jpeg|png)$/i)[0].toLowerCase();
      const newName = `cho-chang-hwan-exhibition-view-${String(i+1).padStart(2,'0')}${ext}`;
      const oldPath = path.join(choExhFolder, f);
      const newPath = path.join(choExhFolder, newName);
      if (oldPath !== newPath) {
        renames.push({
          from: oldPath, to: newPath,
          oldRef: `/assets/images/work/조창환 작가/전시전경/${f}`,
          newRef: `/assets/images/work/조창환 작가/전시전경/${newName}`,
          folder: '조창환 작가/전시전경', oldName: f, newName
        });
      }
    }
  });
}

// Execute
console.log('Planned renames:', renames.length);
let renamed = 0, replacements = 0;

for (const r of renames) {
  if (fs.existsSync(r.from) && !fs.existsSync(r.to)) {
    fs.renameSync(r.from, r.to);
    renamed++;
  }
}
console.log('Files renamed:', renamed);

// Update source references
function walk(dir, files) {
  for (const item of fs.readdirSync(dir)) {
    const p = path.join(dir, item);
    if (item.startsWith('.') || item === 'node_modules' || item === '_site' ||
        item === 'assets' || item === '_data') continue;
    if (fs.statSync(p).isDirectory()) walk(p, files);
    else if (/\.(html|md|yml|yaml|json)$/.test(item)) files.push(p);
  }
}
const files = [];
walk(ROOT, files);

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  for (const r of renames) {
    if (content.includes(r.oldRef)) {
      content = content.split(r.oldRef).join(r.newRef);
      changed = true;
      replacements++;
    }
  }
  if (changed) fs.writeFileSync(file, content, 'utf8');
}
console.log('References updated:', replacements);
