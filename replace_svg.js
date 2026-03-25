const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'gallery', 'visit.html');
let content = fs.readFileSync(filePath, 'utf8');

const svgStart = content.indexOf('<svg class="about-hero-svg"');
const svgEnd = content.indexOf('</svg>', svgStart) + '</svg>'.length;

if (svgStart === -1) {
  console.error('SVG not found!');
  process.exit(1);
}

const newSVG = `<svg class="about-hero-svg" viewBox="0 0 640 290" xmlns="http://www.w3.org/2000/svg" fill="none">

      <!-- ═══════════════════════════════════
           44 Byron St — Floor Plan
           White background, black lines only
           ═══════════════════════════════════ -->

      <rect width="640" height="290" fill="#fff"/>

      <!-- ── BYRON STREET label (left) ── -->
      <text x="45" y="143" font-family="'Inter','Helvetica Neue',sans-serif" font-size="9" fill="#000" letter-spacing="3" text-anchor="middle" font-weight="600" transform="rotate(-90,45,143)">BYRON STREET</text>

      <!-- ══════════════════════════════
           OUTER WALLS
           Building: x=80→510, y=42→245
           ══════════════════════════════ -->

      <!-- Top wall -->
      <line x1="80" y1="42" x2="510" y2="42" stroke="#000" stroke-width="3"/>
      <!-- Bottom wall -->
      <line x1="80" y1="245" x2="510" y2="245" stroke="#000" stroke-width="3"/>
      <!-- Left wall (Byron St) — entrance gap at corridor level y=108→152 -->
      <line x1="80" y1="42" x2="80" y2="108" stroke="#000" stroke-width="3"/>
      <line x1="80" y1="152" x2="80" y2="245" stroke="#000" stroke-width="3"/>
      <!-- Right wall — main building -->
      <line x1="510" y1="42" x2="510" y2="155" stroke="#000" stroke-width="3"/>
      <line x1="510" y1="155" x2="510" y2="245" stroke="#000" stroke-width="3"/>

      <!-- ══════════════════════════════
           UPPER INNER WALL (y=108)
           Separates upper rooms from corridor
           ══════════════════════════════ -->

      <!-- Gallery Room 3 bottom wall — door gap x=160→190 -->
      <line x1="80" y1="108" x2="160" y2="108" stroke="#000" stroke-width="2.5"/>
      <line x1="190" y1="108" x2="215" y2="108" stroke="#000" stroke-width="2.5"/>

      <!-- Storage bottom wall — door gap x=250→275 -->
      <line x1="215" y1="108" x2="250" y2="108" stroke="#000" stroke-width="2.5"/>
      <line x1="275" y1="108" x2="320" y2="108" stroke="#000" stroke-width="2.5"/>

      <!-- Storage 2 area — extends down to y=140 -->
      <!-- (Storage 2 bottom wall at y=140) — door gap x=350→375 -->
      <line x1="320" y1="108" x2="410" y2="108" stroke="#000" stroke-width="2.5"/>

      <!-- Terrace bottom wall — door gap x=435→460 -->
      <line x1="410" y1="108" x2="435" y2="108" stroke="#000" stroke-width="2.5"/>
      <line x1="460" y1="108" x2="510" y2="108" stroke="#000" stroke-width="2.5"/>

      <!-- ══════════════════════════════
           LOWER INNER WALL (y=155)
           Separates corridor from lower rooms
           ══════════════════════════════ -->

      <!-- Gallery Room 4 top wall — door gaps x=115→140 and x=170→195 -->
      <line x1="80" y1="155" x2="115" y2="155" stroke="#000" stroke-width="2.5"/>
      <line x1="140" y1="155" x2="170" y2="155" stroke="#000" stroke-width="2.5"/>
      <line x1="195" y1="155" x2="215" y2="155" stroke="#000" stroke-width="2.5"/>

      <!-- Gallery Room 1 top wall — door gap x=245→275 -->
      <line x1="215" y1="155" x2="245" y2="155" stroke="#000" stroke-width="2.5"/>
      <line x1="275" y1="155" x2="320" y2="155" stroke="#000" stroke-width="2.5"/>

      <!-- Office top wall — door gap x=355→390 -->
      <line x1="320" y1="155" x2="355" y2="155" stroke="#000" stroke-width="2.5"/>
      <line x1="390" y1="155" x2="425" y2="155" stroke="#000" stroke-width="2.5"/>

      <!-- Restrooms top wall -->
      <line x1="425" y1="155" x2="510" y2="155" stroke="#000" stroke-width="2.5"/>

      <!-- ══════════════════════════════
           UPPER ROOM VERTICAL DIVIDERS
           ══════════════════════════════ -->

      <!-- Gallery Room 3 | Storage divider at x=215 -->
      <line x1="215" y1="42" x2="215" y2="108" stroke="#000" stroke-width="2.5"/>

      <!-- Storage | Storage 2 divider at x=320 -->
      <line x1="320" y1="42" x2="320" y2="108" stroke="#000" stroke-width="2.5"/>

      <!-- Storage 2 bottom portion extending into corridor -->
      <!-- Right wall of Storage 2: x=410, y=42→140 -->
      <line x1="410" y1="42" x2="410" y2="108" stroke="#000" stroke-width="2.5"/>
      <!-- Storage 2 protrusion into corridor: x=320→410, y=108→140 -->
      <line x1="320" y1="108" x2="320" y2="140" stroke="#000" stroke-width="2"/>
      <line x1="410" y1="108" x2="410" y2="140" stroke="#000" stroke-width="2"/>
      <!-- Storage 2 bottom wall at y=140 — door gap x=340→365 -->
      <line x1="320" y1="140" x2="340" y2="140" stroke="#000" stroke-width="2"/>
      <line x1="365" y1="140" x2="410" y2="140" stroke="#000" stroke-width="2"/>

      <!-- Terrace left wall at x=410 (shared with Storage 2 right) — already drawn above to y=108 -->
      <!-- But terrace might have its own left wall: from y=42 to y=108 at x=410 — already drawn -->

      <!-- ══════════════════════════════
           LOWER ROOM VERTICAL DIVIDERS
           ══════════════════════════════ -->

      <!-- Gallery Room 4 | Gallery Room 1 divider at x=215 -->
      <line x1="215" y1="155" x2="215" y2="245" stroke="#000" stroke-width="2.5"/>

      <!-- Gallery Room 1 | Office divider at x=320 -->
      <line x1="320" y1="155" x2="320" y2="245" stroke="#000" stroke-width="2.5"/>

      <!-- Office | Restroom divider at x=425 -->
      <line x1="425" y1="155" x2="425" y2="245" stroke="#000" stroke-width="2.5"/>

      <!-- Restroom | Women's Restroom divider at x=475 -->
      <line x1="475" y1="155" x2="475" y2="245" stroke="#000" stroke-width="2.5"/>

      <!-- Women's Restroom extends right — outer wall extension -->
      <!-- Right extension wall: x=510→555 at y=155 -->
      <line x1="510" y1="155" x2="555" y2="155" stroke="#000" stroke-width="3"/>
      <!-- Far right wall: x=555, y=155→245 -->
      <line x1="555" y1="155" x2="555" y2="245" stroke="#000" stroke-width="3"/>
      <!-- Bottom wall extension: x=510→555 at y=245 -->
      <line x1="510" y1="245" x2="555" y2="245" stroke="#000" stroke-width="3"/>

      <!-- ══════════════════════════════
           ROOM LABELS
           ══════════════════════════════ -->

      <!-- Upper rooms -->
      <text x="148" y="78" font-family="'Inter','Helvetica Neue',sans-serif" font-size="8" fill="#000" text-anchor="middle" font-weight="500">갤러리 룸 3</text>

      <text x="268" y="78" font-family="'Inter','Helvetica Neue',sans-serif" font-size="8" fill="#000" text-anchor="middle" font-weight="500">창고</text>

      <text x="365" y="126" font-family="'Inter','Helvetica Neue',sans-serif" font-size="8" fill="#000" text-anchor="middle" font-weight="500">창고 2</text>

      <text x="460" y="78" font-family="'Inter','Helvetica Neue',sans-serif" font-size="8" fill="#000" text-anchor="middle" font-weight="500">테라스</text>

      <!-- Corridor / central area -->
      <text x="190" y="135" font-family="'Inter','Helvetica Neue',sans-serif" font-size="9" fill="#000" text-anchor="middle" font-weight="600" letter-spacing="1">갤러리 룸 2</text>

      <text x="465" y="135" font-family="'Inter','Helvetica Neue',sans-serif" font-size="9" fill="#000" text-anchor="middle" font-weight="600" letter-spacing="1">카페</text>

      <!-- Lower rooms -->
      <text x="148" y="205" font-family="'Inter','Helvetica Neue',sans-serif" font-size="8" fill="#000" text-anchor="middle" font-weight="500">갤러리 룸 4</text>

      <text x="268" y="205" font-family="'Inter','Helvetica Neue',sans-serif" font-size="8" fill="#000" text-anchor="middle" font-weight="500">갤러리 룸 1</text>

      <text x="373" y="205" font-family="'Inter','Helvetica Neue',sans-serif" font-size="8" fill="#000" text-anchor="middle" font-weight="500">오피스</text>

      <text x="450" y="205" font-family="'Inter','Helvetica Neue',sans-serif" font-size="8" fill="#000" text-anchor="middle" font-weight="500">화장실</text>

      <text x="518" y="195" font-family="'Inter','Helvetica Neue',sans-serif" font-size="7" fill="#000" text-anchor="middle" font-weight="500">여자</text>
      <text x="518" y="210" font-family="'Inter','Helvetica Neue',sans-serif" font-size="7" fill="#000" text-anchor="middle" font-weight="500">화장실</text>

    </svg>`;

content = content.slice(0, svgStart) + newSVG + content.slice(svgEnd);
fs.writeFileSync(filePath, content, 'utf8');
console.log('Done! SVG replaced with black & white floor plan.');
