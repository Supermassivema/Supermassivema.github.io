const fs = require('fs');
const path = require('path');

const artistsDir = 'e:/Github/Supermassivema.github.io/Supermassivema.github.io/_artists';
const featuredArtists = [
    'min-hea-jung-soo.md',
    'lee-sang-kwon.md',
    'cho-chang-hwan.md',
    'geum-sahong.md'
];

const files = fs.readdirSync(artistsDir);
files.forEach(file => {
    if (file.endsWith('.md')) {
        const filePath = path.join(artistsDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        const isFeatured = featuredArtists.includes(file);

        // Split by front matter markers
        const parts = content.split('---');
        if (parts.length >= 3) {
            let frontMatter = parts[1];
            if (frontMatter.includes('featured:')) {
                frontMatter = frontMatter.replace(/featured: .*/, `featured: ${isFeatured}`);
            } else {
                frontMatter += `featured: ${isFeatured}\n`;
            }
            parts[1] = frontMatter;
            content = parts.join('---');
            fs.writeFileSync(filePath, content);
            console.log(`Updated ${file}: featured=${isFeatured}`);
        }
    }
});
