const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const INPUT_FOLDER = './input';   // Put your HTML files here
const OUTPUT_FOLDER = './output'; // PDFs will be saved here
const PDF_OPTIONS = {
  format: 'A4',
  printBackground: true,   // Preserves colored backgrounds
  margin: {
    top: '20px',
    bottom: '20px',
    left: '20px',
    right: '20px'
  }
};
// ──────────────────────────────────────────────────────────────────────────────

async function convertHTMLtoPDF() {
  // Create output folder if it doesn't exist
  if (!fs.existsSync(OUTPUT_FOLDER)) {
    fs.mkdirSync(OUTPUT_FOLDER, { recursive: true });
  }

  // Get all HTML files from input folder
  const htmlFiles = fs.readdirSync(INPUT_FOLDER)
    .filter(file => file.endsWith('.html') || file.endsWith('.htm'));

  if (htmlFiles.length === 0) {
    console.log('❌ No HTML files found in ./input folder');
    console.log('   Add your .html files to the input/ folder and run again.');
    return;
  }

  console.log(`\n🚀 Found ${htmlFiles.length} HTML file(s) to convert...\n`);

  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Set viewport to A4 width for accurate rendering
  await page.setViewportSize({ width: 1240, height: 1754 });

  let successCount = 0;
  let failCount = 0;

  for (const file of htmlFiles) {
    const inputPath = path.resolve(INPUT_FOLDER, file);
    const outputFileName = file.replace(/\.html?$/, '.pdf');
    const outputPath = path.resolve(OUTPUT_FOLDER, outputFileName);

    try {
      console.log(`⏳ Converting: ${file}`);

      // Load HTML file — file:// protocol ensures local assets (images, CSS) load too
      await page.goto(`file://${inputPath}`, {
        waitUntil: 'networkidle', // Wait for Google Fonts and all assets to load
        timeout: 30000
      });

      await page.emulateMedia({ media: 'screen' });
      
      // Extra wait to ensure web fonts render correctly
      await page.waitForTimeout(1000);

      await page.pdf({
        path: outputPath,
        ...PDF_OPTIONS
      });

      console.log(`✅ Done: ${outputFileName}`);
      successCount++;

    } catch (err) {
      console.log(`❌ Failed: ${file} — ${err.message}`);
      failCount++;
    }
  }

  await browser.close();

  console.log(`\n──────────────────────────────`);
  console.log(`✅ Converted: ${successCount} file(s)`);
  if (failCount > 0) console.log(`❌ Failed:    ${failCount} file(s)`);
  console.log(`📁 PDFs saved to: ${OUTPUT_FOLDER}/`);
  console.log(`──────────────────────────────\n`);
}

convertHTMLtoPDF().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
