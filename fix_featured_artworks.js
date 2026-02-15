const fs = require('fs');
const path = require('path');

const artworksDir = 'e:/Github/Supermassivema.github.io/Supermassivema.github.io/_artworks';

// 1. Featured Min Hea Jung Soo works (top 4)
const mhjsWorks = [
    'min-hea-jung-soo-work-1.md',
    'min-hea-jung-soo-work-2.md',
    'min-hea-jung-soo-work-3.md',
    'min-hea-jung-soo-work-4.md'
];

mhjsWorks.forEach(file => {
    const filePath = path.join(artworksDir, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        const parts = content.split('---');
        if (parts.length >= 3) {
            let frontMatter = parts[1];
            if (frontMatter.includes('featured:')) {
                frontMatter = frontMatter.replace(/featured: .*/, 'featured: true');
            } else {
                frontMatter += 'featured: true\n';
            }
            parts[1] = frontMatter;
            content = parts.join('---');
            fs.writeFileSync(filePath, content);
            console.log(`Featured artwork: ${file}`);
        }
    }
});

// 2. Also ensure some other artists have featured works to fill up if needed
const otherFeatured = [
    'cho-chang-hwan-work-1.md',
    'lee-sang-kwon-work-1.md'
];

otherFeatured.forEach(file => {
    const filePath = path.join(artworksDir, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        const parts = content.split('---');
        if (parts.length >= 3) {
            let frontMatter = parts[1];
            if (frontMatter.includes('featured:')) {
                frontMatter = frontMatter.replace(/featured: .*/, 'featured: true');
            } else {
                frontMatter += 'featured: true\n';
            }
            parts[1] = frontMatter;
            content = parts.join('---');
            fs.writeFileSync(filePath, content);
            console.log(`Featured other artwork: ${file}`);
        }
    }
});
