import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Skrifa HTML fyrir yfirlit í index.html
 * @param {any} data Gögn til að skrifa
 * @returns {Promise<void>}
 */
export async function writeHtml(indexData) {

  await fs.mkdir('dist', { recursive: true });

  const htmlFilePath = path.join('dist', 'index.html');

  const listItems = indexData
    .map((item) => {
      if (!item.title || !item.file) {
        return '';
      }
      const outFileName = item.file.replace('.json', '.html');
      return `<li><a href="${outFileName}">${item.title}</a></li>`;
    })
    .join('\n');

  const htmlContent = `
    <!doctype html>
    <html lang="is">
      <head>
        <title>Verkefni 1</title>
        <meta charset="utf-8">
        <link rel="stylesheet" href="../public/styles.css">
      </head>
      <body>
        <h1>Verkefni 1</h1>
        <h2>Spurningasíða, Veldu flokk:</h2>
        <ul>
          ${listItems}
        </ul>
        <footer>
          <a href="https://benjaminni.is/">Benjaminni.is</a>
        </footer>
      </body>
    </html>
      `;


      await fs.writeFile(htmlFilePath, htmlContent, 'utf8');
      console.log('Wrote overall index.html to', htmlFilePath);
}

