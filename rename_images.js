const fs = require('fs');
const path = require('path');

const artworksDir = 'e:/Github/Supermassivema.github.io/Supermassivema.github.io/_artworks';
const imagesDir = 'e:/Github/Supermassivema.github.io/Supermassivema.github.io/assets/images/work/Min hea jung soo';

const mapping = {
    "스며든 것들Ⅱ┃민해정수┃162.2x97.0㎝┃캔버스 위에 캐스팅 한지,수채염색┃아크릴 커버액자│2025.jpg": "work_01.jpg",
    "민해정수-연년유여[連年有餘] 시리즈 '어리호박벌과 진달래꽃’-53.0x45.5cm-10호 F사이즈-traditional korean paper on canvas-2023.jpg": "work_02.jpg",
    "민해정수-연년유여[連年有餘] 시리즈 '세차게 소낙비가 한 차례  내린 뒤'-72.7x60.6cm 20호 F사이즈-Traditional korean paper on canvas-2022.jpg": "work_03.jpg",
    "★[SOLD]소담소담,민해정수, 6호F(40.9 x 31.8 cm), Traditional korean paper casting on canvas, 2023.jpg": "work_04.jpg"
};

// 1. Rename image files
for (const [oldName, newName] of Object.entries(mapping)) {
    const oldPath = path.join(imagesDir, oldName);
    const newPath = path.join(imagesDir, newName);
    if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
        console.log(`Renamed ${oldName} -> ${newName}`);
    }
}

// 2. Update artwork files with new names
const artworkFiles = fs.readdirSync(artworksDir);
artworkFiles.forEach(file => {
    if (file.endsWith('.md')) {
        const filePath = path.join(artworksDir, file);
        let content = fs.readFileSync(filePath, 'utf8');

        let changed = false;
        for (const [oldName, newName] of Object.entries(mapping)) {
            if (content.includes(oldName)) {
                content = content.replace(oldName, newName);
                changed = true;
            }
        }

        if (changed) {
            fs.writeFileSync(filePath, content);
            console.log(`Updated references in ${file}`);
        }
    }
});
