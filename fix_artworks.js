const fs = require('fs');
const path = require('path');

const artworksDir = 'e:/Github/Supermassivema.github.io/Supermassivema.github.io/_artworks';
const artworkFiles = fs.readdirSync(artworksDir);

// 1. Fix artist name casing and standardize titles
artworkFiles.forEach(file => {
    if (file.endsWith('.md')) {
        const filePath = path.join(artworksDir, file);
        let content = fs.readFileSync(filePath, 'utf8');

        // Fix Min Hea Jung Soo
        content = content.replace(/artist: "Min hea jung soo"/g, 'artist: "Min Hea Jung Soo"');
        content = content.replace(/title: "Min hea jung soo - Work/g, 'title: "Min Hea Jung Soo - Work');
        content = content.replace(/Min hea jung soo/g, 'Min Hea Jung Soo');

        fs.writeFileSync(filePath, content);
    }
});

// 2. Map real images for Min Hea Jung Soo (top 4)
const realImages = [
    "스며든 것들Ⅱ┃민해정수┃162.2x97.0㎝┃캔버스 위에 캐스팅 한지,수채염색┃아크릴 커버액자│2025.jpg",
    "민해정수-연년유여[連年有餘] 시리즈 '어리호박벌과 진달래꽃’-53.0x45.5cm-10호 F사이즈-traditional korean paper on canvas-2023.jpg",
    "민해정수-연년유여[連年有餘] 시리즈 '세차게 소낙비가 한 차례  내린 뒤'-72.7x60.6cm 20호 F사이즈-Traditional korean paper on canvas-2022.jpg",
    "★[SOLD]소담소담,민해정수, 6호F(40.9 x 31.8 cm), Traditional korean paper casting on canvas, 2023.jpg"
];

const mhjsWorks = [
    'min-hea-jung-soo-work-1.md',
    'min-hea-jung-soo-work-2.md',
    'min-hea-jung-soo-work-3.md',
    'min-hea-jung-soo-work-4.md'
];

mhjsWorks.forEach((file, index) => {
    const filePath = path.join(artworksDir, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');

        // Update image path
        const imageName = realImages[index];
        const newImagePath = `/assets/images/work/Min hea jung soo/${imageName}`;
        content = content.replace(/image: .*/, `image: ${newImagePath}`);

        // Set featured
        if (!content.includes('featured:')) {
            content = content.replace(/---$/, `featured: true\n---`);
        } else {
            content = content.replace(/featured: .*/, 'featured: true');
        }

        fs.writeFileSync(filePath, content);
    }
});

// 3. Feature some Geum Sahong works
['geum-sahong-work-1.md', 'geum-sahong-work-2.md'].forEach(file => {
    const filePath = path.join(artworksDir, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        if (!content.includes('featured:')) {
            content = content.replace(/---$/, `featured: true\n---`);
        } else {
            content = content.replace(/featured: .*/, 'featured: true');
        }
        fs.writeFileSync(filePath, content);
    }
});

console.log('Artwork metadata updated successfully.');
