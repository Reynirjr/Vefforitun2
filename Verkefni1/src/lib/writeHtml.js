import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Skrifa HTML fyrir yfirlit í index.html
 * @param {any} data Gögn til að skrifa
 * @returns {Promise<void>}
 */
export async function writeHtml(indexData) {

  

  const htmlFilePath = path.join('dist', 'index.html');

  const listItems = indexData
    .map((item) => {
      if (!item.title || !item.file) {
        return '';
      }
      const outFileName = item.file.replace('.json', '.html');
      return `<li class="flokkar"><a href="${outFileName}">${item.title}</a></li>`;
    })
    .join('\n');

  const htmlContent = `
    <!doctype html>
    <html lang="is">
      <head>
        <title>Verkefni 1</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="./styles.css">
      </head>
      <body>
        <header>
          <div id="background-wrap">
            <div class="x1">
              <div class="sky"></div>
            </div>

            <div class="x2">
              <div class="sky"></div>
            </div>

            <div class="x3">
              <div class="sky"></div>
            </div>

            <div class="x4">
              <div class="sky"></div>
            </div>

            <div class="x5">
              <div class="sky"></div>
            </div>
          
          </div>
        </header>
        <main>
          <h1>Verkefni 1</h1>
          <h2>Spurningasíða, Veldu flokk:</h2>
          <ul>
            ${listItems}
          </ul>
        </main>
      </body>
    </html>
      `;


      await fs.writeFile(htmlFilePath, htmlContent, 'utf8');
      console.log('Wrote overall index.html to', htmlFilePath);
}

