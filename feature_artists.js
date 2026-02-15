const fs = require('fs');
const path = require('path');

const artistsDir = 'e:/Github/Supermassivema.github.io/Supermassivema.github.io/_artists';
const featuredArtists = [
    'min-hea-jung-soo.md',
    'lee-sang-kwon.md',
    'cho-chang-hwan.md',
    'geum-sahong.md'
];

// 1. Mark artists as featured
const files = fs.readdirSync(artistsDir);
files.forEach(file => {
    if (file.endsWith('.md')) {
        const filePath = path.join(artistsDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        const isFeatured = featuredArtists.includes(file);

        if (content.includes('featured:')) {
            content = content.replace(/featured: .*/, `featured: ${isFeatured}`);
        } else {
            content = content.replace(/---$/, `featured: ${isFeatured}\n---`);
        }

        fs.writeFileSync(filePath, content);
    }
});

// 2. Update home page to use featured artists
const homePath = 'e:/Github/Supermassivema.github.io/Supermassivema.github.io/gallery/index.html';
let homeContent = fs.readFileSync(homePath, 'utf8');

homeContent = homeContent.replace(
    /{% for artist in site.artists limit: 4 %}/,
    '{% assign featured_artists = site.artists | where: "featured", true %}\n      {% for artist in featured_artists limit: 4 %}'
);

fs.writeFileSync(homePath, homeContent);
console.log('Artists featured and homepage updated.');
