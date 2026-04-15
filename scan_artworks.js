const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const WORK_DIR = path.join(ROOT, 'assets/images/work');
const DATA_OUT = path.join(ROOT, '_data/artworks.json');

// Artist folder → canonical name + slug prefix
const ARTIST_MAP = {
  'DebbieDoye': { name: 'Debbie Doye', slug: 'debbie-doye' },
  'Geum Sahong': { name: 'Geum Sahong', slug: 'geum-sahong' },
  'MinHeaJungSoo': { name: 'Min Hea Jung Soo', slug: 'min-hea-jung-soo' },
  'Stephen Jones': { name: 'Stephen Jones', slug: 'stephen-jones' },
  '이상권 작가': { name: 'Lee Sang-kwon', slug: 'lee-sang-kwon' },
  '조창환 작가': { name: 'Cho Chang-hwan', slug: 'cho-chang-hwan' }
};

// Korean → Roman title map
const TITLE_ROMAN = {
  '호작도': 'Tiger and Magpie',
  '부귀': 'Prosperity',
  '입신': 'Ascension',
  '부활': 'Resurrection',
  '희망': 'Hope',
  '풍요': 'Abundance',
  '겸허': 'Humility',
  '화목': 'Harmony',
  '모란도': 'Peony',
  '연모도': 'Love Birds',
  '일월오봉도': 'Irworobongdo',
  '숨은 길 찾기': 'A Hidden Path',
  '여행길': "One's Journey",
  '오래된 정원': 'An Old Garden',
  '흐르는 물': 'Flowing Water',
  '걷는 사람들': 'People Walking'
};

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function parseFilename(filename, artist) {
  const base = filename.replace(/\.(jpg|jpeg|png)$/i, '');
  const ext = filename.match(/\.(jpg|jpeg|png)$/i)[0].toLowerCase();
  const result = {
    filename: filename,
    ext: ext,
    title: '',
    titleKr: '',
    size: '',
    medium: '',
    year: '',
    price_aud: null,
    sold: false
  };

  // Detect sold out
  if (/sold\s*out/i.test(base)) result.sold = true;

  // Extract price
  const priceMatch = base.match(/(\d[\d,]*)\s*aud/i);
  if (priceMatch) {
    result.price_aud = parseInt(priceMatch[1].replace(/,/g, ''), 10);
  }

  // Extract year
  const yearMatch = base.match(/\b(19|20)\d{2}\b/);
  if (yearMatch) result.year = yearMatch[0];

  // Extract dimensions (20x20cm, 72.7x60.6cm, etc.)
  const sizeMatch = base.match(/\d+(?:\.\d+)?\s*x\s*\d+(?:\.\d+)?\s*cm/i);
  if (sizeMatch) result.size = sizeMatch[0].replace(/\s+/g, '');

  // Extract medium
  const mediumPatterns = [
    /Acrylic\s+on\s+canvas/i,
    /Acrylic\s+on\s+Paper/i,
    /Oil\s+on\s+canvas/i,
    /Charcoal\s+on\s+Paper/i,
    /Cont[eé]\s+on\s+(?:Paper|Canvas)/i,
    /Mixed\s+Media[,\s]*Ceramic/i,
    /Mixed\s+Media-Ceramic/i,
    /Ceramics?/i,
  ];
  for (const p of mediumPatterns) {
    const m = base.match(p);
    if (m) { result.medium = m[0].replace(/-/g, ' ').replace(/\s+/g, ' ').trim(); break; }
  }

  // Extract Korean title (artist-specific)
  if (artist === 'Geum Sahong') {
    // Pattern: "ENGNAME-Artwork No.XXXX 한글-..."
    const m = base.match(/Artwork\s+No\.\d+\s*([가-힣]+)/);
    if (m) {
      result.titleKr = m[1];
      result.title = TITLE_ROMAN[m[1]] || m[1];
    }
    // No. extraction
    const noMatch = base.match(/No\.(\d+)/);
    if (noMatch) result.no = 'No.' + noMatch[1];
  } else if (artist === 'Debbie Doye') {
    // Pattern: "Title-Mixed Media-Ceramic-XXXaud"
    const titleMatch = base.split('-')[0].trim();
    result.title = titleMatch;
    if (!result.medium) result.medium = 'Ceramics';
  } else if (artist === 'Stephen Jones') {
    const titleMatch = base.split('-')[0].trim();
    result.title = titleMatch;
  } else if (artist === 'Lee Sang-kwon') {
    const m = base.match(/\d+[,_]?([가-힣\s]+)/);
    if (m) {
      result.titleKr = m[1].trim();
      for (const [kr, en] of Object.entries(TITLE_ROMAN)) {
        if (result.titleKr.includes(kr)) { result.title = en; break; }
      }
    }
  }

  return result;
}

function generateSlug(meta, artistSlug, index) {
  // Priority: title + no → title → number
  let base = '';
  if (meta.title) base = slugify(meta.title);
  if (meta.no) base += '-' + meta.no.toLowerCase().replace('.', '');
  if (!base) base = 'work-' + String(index).padStart(3, '0');
  return `${artistSlug}-${base}${meta.ext}`;
}

// Scan
const artworks = [];
const renames = [];

const artistDirs = fs.readdirSync(WORK_DIR).filter(d => {
  const p = path.join(WORK_DIR, d);
  return fs.statSync(p).isDirectory() && ARTIST_MAP[d];
});

for (const artistFolder of artistDirs) {
  const info = ARTIST_MAP[artistFolder];
  const artistPath = path.join(WORK_DIR, artistFolder);
  const files = fs.readdirSync(artistPath).filter(f => /\.(jpg|jpeg|png)$/i.test(f));

  const usedSlugs = new Set();
  let idx = 1;
  for (const filename of files) {
    // Skip profile / special files
    const lower = filename.toLowerCase();
    if (lower.includes('profile') || lower.includes('프로필') ||
        lower.includes('resizing') || filename === 'work.jpg') {
      continue;
    }

    const meta = parseFilename(filename, info.name);
    let newSlug = generateSlug(meta, info.slug, idx);
    // Handle duplicates
    if (usedSlugs.has(newSlug)) {
      const name = newSlug.replace(/\.(jpg|jpeg|png)$/i, '');
      const ext = newSlug.match(/\.(jpg|jpeg|png)$/i)[0];
      let n = 2;
      while (usedSlugs.has(`${name}-${n}${ext}`)) n++;
      newSlug = `${name}-${n}${ext}`;
    }
    usedSlugs.add(newSlug);

    const fullItem = {
      artist: info.name,
      artist_slug: info.slug,
      filename: filename,
      slug: newSlug,
      old_path: `/assets/images/work/${artistFolder}/${filename}`,
      new_path: `/assets/images/work/${artistFolder}/${newSlug}`,
      title: meta.title || null,
      title_kr: meta.titleKr || null,
      no: meta.no || null,
      size: meta.size || null,
      medium: meta.medium || null,
      year: meta.year || null,
      price_aud: meta.price_aud,
      sold: meta.sold
    };

    artworks.push(fullItem);

    if (filename !== newSlug) {
      renames.push({
        from: path.join(artistPath, filename),
        to: path.join(artistPath, newSlug),
        oldRef: fullItem.old_path,
        newRef: fullItem.new_path
      });
    }

    idx++;
  }
}

// Write JSON
fs.writeFileSync(DATA_OUT, JSON.stringify(artworks, null, 2), 'utf8');
console.log('Wrote JSON:', artworks.length, 'artworks →', DATA_OUT);
console.log('Files to rename:', renames.length);

// Write rename plan (dry run by default)
const renamePlan = path.join(ROOT, '_data/renames.json');
fs.writeFileSync(renamePlan, JSON.stringify(renames, null, 2), 'utf8');
console.log('Rename plan:', renamePlan);

// Execute renames if --apply
if (process.argv.includes('--apply')) {
  for (const r of renames) {
    if (fs.existsSync(r.from)) {
      fs.renameSync(r.from, r.to);
      console.log('Renamed:', path.basename(r.from), '→', path.basename(r.to));
    }
  }

  // Update source code references
  const filesToUpdate = [];
  function walk(dir) {
    for (const item of fs.readdirSync(dir)) {
      const p = path.join(dir, item);
      if (item.startsWith('.') || item === 'node_modules' || item === '_site' ||
          item === 'assets' || item === '_data') continue;
      if (fs.statSync(p).isDirectory()) { walk(p); }
      else if (/\.(html|md|yml|yaml|json)$/.test(item)) {
        filesToUpdate.push(p);
      }
    }
  }
  walk(ROOT);

  let replacements = 0;
  for (const file of filesToUpdate) {
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
  console.log('Updated references:', replacements);
}
