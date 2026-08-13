#!/usr/bin/env python3
"""ART SPACE BYRON — news thumbnail generator.
Original artwork only: region-coloured gradients + abstract geometry.
No source photographs are copied or imitated.
"""
import hashlib, math, os, sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H = 1600, 900                      # 16:9, matches article hero (object-fit: contain)
CROP_X0, CROP_X1 = 200, 1400          # visible band after 4:3 card crop (object-fit: cover)
SAFE_X0, SAFE_X1 = 296, 1304          # content inset inside that band, so nothing clips

REGION = {                            # exact colours from news/index.html
    "global":    ((0x25, 0x63, 0xeb), (0x1e, 0x3a, 0x8a)),
    "australia": ((0x15, 0x9e, 0x63), (0x0b, 0x5e, 0x3b)),
    "korea":     ((0xd4, 0x48, 0x3b), (0x8f, 0x28, 0x20)),
}
FONTS = "/home/claude/fonts"
INTER, PLAYFAIR = f"{FONTS}/inter.ttf", f"{FONTS}/playfair.ttf"


def font(path, size, weight=None):
    f = ImageFont.truetype(path, size)
    if weight:
        try:
            f.set_variation_by_axes([weight])
        except Exception:
            pass
    return f


def gradient(c0, c1):
    """135deg linear gradient, matching the site's CSS placeholders."""
    base = Image.new("RGB", (W, H))
    px = base.load()
    for y in range(H):
        for x in range(0, W, 8):
            t = (x / W + y / H) / 2
            col = tuple(int(c0[i] + (c1[i] - c0[i]) * t) for i in range(3))
            for dx in range(8):
                if x + dx < W:
                    px[x + dx, y] = col
    return base


def geometry(img, seed, c1):
    """Tone-on-tone abstract composition. One of four archetypes, chosen by hash."""
    rnd = hashlib.sha256(seed.encode()).digest()
    v = [b / 255 for b in rnd]
    S = 2                                       # supersample for clean edges
    layer = Image.new("RGBA", (W * S, H * S), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    L, D = (255, 255, 255), c1
    kind = rnd[0] % 4

    def disc(cx, cy, r, fill):
        d.ellipse([(cx - r) * S, (cy - r) * S, (cx + r) * S, (cy + r) * S], fill=fill)

    def ring(cx, cy, r, col, w=3):
        d.ellipse([(cx - r) * S, (cy - r) * S, (cx + r) * S, (cy + r) * S],
                  outline=col, width=w * S)

    if kind == 0:                               # concentric rings, off-centre
        cx, cy = int(W * (0.7 + v[1] * 0.18)), int(H * (0.34 + v[2] * 0.3))
        disc(cx, cy, int(H * (0.44 + v[3] * 0.2)), D + (56,))
        for i in range(7):
            ring(cx, cy, int(H * (0.16 + i * 0.105 + v[4] * 0.05)), L + (34,))
    elif kind == 1:                             # overlapping discs
        disc(int(W * (0.66 + v[1] * 0.2)), int(H * (0.3 + v[2] * 0.2)),
             int(H * (0.42 + v[3] * 0.18)), L + (24,))
        disc(int(W * (0.5 + v[4] * 0.16)), int(H * (0.72 + v[5] * 0.24)),
             int(H * (0.4 + v[6] * 0.2)), D + (62,))
        ring(int(W * (0.3 + v[7] * 0.14)), int(H * (0.3 + v[8] * 0.2)),
             int(H * (0.3 + v[9] * 0.14)), L + (40,))
    elif kind == 2:                             # diagonal bands
        bw = int(H * (0.1 + v[1] * 0.06))
        off = int(W * v[2] * 0.3)
        for i in range(7):
            x = off + i * bw * 3
            d.polygon([((x) * S, H * S), ((x + bw) * S, H * S),
                       ((x + bw + int(H * 0.9)) * S, 0), ((x + int(H * 0.9)) * S, 0)],
                      fill=L + (20 if i % 2 else 30,))
        disc(int(W * (0.72 + v[3] * 0.16)), int(H * (0.62 + v[4] * 0.24)),
             int(H * (0.34 + v[5] * 0.16)), D + (58,))
    else:                                       # rule field + single disc
        disc(int(W * (0.62 + v[1] * 0.24)), int(H * (0.42 + v[2] * 0.3)),
             int(H * (0.46 + v[3] * 0.2)), D + (52,))
        n, gap = 14 + int(v[4] * 10), int(H * 0.05)
        y0 = int(H * (0.12 + v[5] * 0.2))
        for i in range(n):
            y = y0 + i * gap
            if y > H:
                break
            x0 = int(W * (0.46 + v[6] * 0.2))
            d.line([x0 * S, y * S, W * S, y * S], fill=L + (26,), width=2 * S)
        ring(int(W * (0.26 + v[7] * 0.12)), int(H * (0.68 + v[8] * 0.2)),
             int(H * (0.26 + v[9] * 0.12)), L + (44,))

    layer = layer.resize((W, H), Image.LANCZOS)
    return Image.alpha_composite(img.convert("RGBA"), layer).convert("RGB")


def vignette(img):
    v = Image.new("L", (W, H), 0)
    ImageDraw.Draw(v).ellipse([-W * 0.3, -H * 0.55, W * 1.3, H * 1.55], fill=90)
    v = v.filter(ImageFilter.GaussianBlur(160))
    shade = Image.new("RGB", (W, H), (0, 0, 0))
    return Image.composite(img, Image.blend(img, shade, 0.22), v)


def wrap(draw, text, fnt, max_w):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if draw.textlength(t, font=fnt) <= max_w:
            cur = t
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def build(region, slug, headline=None, source=None, style="mark"):
    c0, c1 = REGION[region]
    img = vignette(geometry(gradient(c0, c1), slug, c1))
    d = ImageDraw.Draw(img)

    f_mark = font(INTER, 26, 600)
    f_region = font(INTER, 22, 600)
    f_head = font(PLAYFAIR, 62, 600)
    f_src = font(INTER, 24, 400)

    # wordmark, top-left of safe band
    def spaced(t, sp=6):
        return (" " * 0).join(t)  # placeholder, real spacing below

    def draw_tracked(xy, text, fnt, fill, track):
        x, y = xy
        for ch in text:
            d.text((x, y), ch, font=fnt, fill=fill)
            x += d.textlength(ch, font=fnt) + track
        return x

    draw_tracked((SAFE_X0, 92), "ART SPACE BYRON", f_mark, (255, 255, 255, 255), 5)
    d.line([SAFE_X0, 140, SAFE_X0 + 88, 140], fill=(255, 255, 255), width=3)

    # region label, bottom-left
    dot_y = H - 132
    d.ellipse([SAFE_X0, dot_y, SAFE_X0 + 14, dot_y + 14], fill=(255, 255, 255))
    draw_tracked((SAFE_X0 + 30, dot_y - 6), region.upper(), f_region, (255, 255, 255), 4)

    if style == "type" and headline:
        lines = wrap(d, headline, f_head, SAFE_X1 - SAFE_X0)[:3]
        y = H // 2 - (len(lines) * 78) // 2 - 20
        for ln in lines:
            d.text((SAFE_X0, y), ln, font=f_head, fill=(255, 255, 255))
            y += 78
        if source:
            d.text((SAFE_X0, H - 96), source, font=f_src, fill=(255, 255, 255, 220))
    else:
        if source:
            tw = d.textlength(source, font=f_src)
            d.text((SAFE_X1 - tw, dot_y - 4), source, font=f_src, fill=(255, 255, 255))

    return img


def save(img, out_base):
    img.save(out_base + ".jpg", "JPEG", quality=88, optimize=True, progressive=True)
    img.save(out_base + ".webp", "WEBP", quality=82, method=6)


if __name__ == "__main__":
    import json
    items = json.load(open(sys.argv[1]))
    outdir = sys.argv[2]
    style = sys.argv[3] if len(sys.argv) > 3 else "mark"
    os.makedirs(outdir, exist_ok=True)
    for it in items:
        img = build(it["region"], it["slug"], it.get("headline"), it.get("source"), style)
        base = os.path.join(outdir, it["slug"])
        save(img, base)
        print("wrote", base + ".jpg", "+ .webp")
