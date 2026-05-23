# HTML to PDF Converter (Playwright)

Converts HTML files with custom CSS, Google Fonts, and colored backgrounds to pixel-perfect PDFs.

---

## Setup (One time only)

```bash
# 1. Install dependencies
npm install

# 2. Install Chromium browser for Playwright
npx playwright install chromium
```

---

## How to Use

1. Drop your `.html` files into the `input/` folder
2. Run the converter:

```bash
node convert.js
```

3. Your PDFs appear in the `output/` folder

---

## What's Preserved
- ✅ Custom CSS styles
- ✅ Google Fonts (waits for full load)
- ✅ Colored backgrounds
- ✅ Images and local assets
- ✅ A4 format

---

## Customize PDF Options
Edit these in `convert.js` at the top:
- `format` — A4, A3, Letter, Legal
- `margin` — top/bottom/left/right
- `printBackground` — keep true for colored backgrounds
