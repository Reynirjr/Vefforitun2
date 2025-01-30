import fs from 'node:fs/promises';
import path from 'node:path';

import { readJson } from './lib/readJson.js';
import { validateCategory } from './lib/validateCategory.js';
import { geraFlokkHtml } from './lib/generateHtml.js';
import { writeHtml } from './lib/writeHtml.js';

const INDEX_PATH = './data/index.json';

/**
 * Les index.json 
 * skrifar síðan dist/index.html
 * gerir síðan fyrir hvern gildan flokk html skrá í dist
 */
export async function main() {

  await fs.mkdir('dist', { recursive: true });

  await fs.copyFile(
    path.join('public', 'styles.css'),
    path.join('dist', 'styles.css')
  );

  const indexJson = await readJson(INDEX_PATH);
  if (!Array.isArray(indexJson)) {
    console.error('index.json er ekki á réttu formi (fylki)');
    return;
  }

  const validCategories = [];

  

  for (const item of indexJson) {
    if (!item.file) {
      console.log('Ekkert "file" í þessum flokk sleppi slepp:', item);
      continue;
    }

    const filePath = path.join('./data', item.file);
    const raw = await readJson(filePath);
    if (!raw) {
      console.log(`Sleppum ${item.file} vegna villna við að lesa gögn`);
      continue;
    }

    const content = validateCategory(raw);
    if (!content) {
      console.log(`sleppum ${item.file} vegna villna við að staðfesta gögn`);
      continue;
    }

    const html = geraFlokkHtml(content);

    const outFileName = item.file.replace('.json', '.html');
    const outPath = path.join('dist', outFileName); 
    await fs.writeFile(outPath, html, 'utf-8');
    console.log(`skrifaði ${outPath}`);

    validCategories.push({
      title: content.title,
      file: outFileName,
    });
  }

  await writeHtml(validCategories);
  console.log('Ég er búúúinnn!');
}

main().catch((err) => {
  console.error('Error in main():', err);
});