import fs from 'node:fs/promises';
import path from 'node:path';

const INDEX_PATH = '../data/index.json';

async function readJson(filePath) {
  console.log('starting to read', filePath);
  try {
    const data = await fs.readFile(path.resolve(filePath), 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return null;
  }
}

function geraIndexHtml(flokkar) {
  const hlekkir = flokkar
   .map((cat) => {
    if(!cat.file || !cat.title) {
      return '';
    } 
    return`
        <li>
          <a href="${cat.file.replace('.json', '.html')}">${cat.title}</a>
        </li>
    `;
  })
  .join('');


  return `
  <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Index</title>
        <link rel="stylesheet" href="../../public/styles.css" />
        <width=device-width, initial-scale=1.0>
      </head>
      <body>
        <h1>Velkominn í Spurningarleikinn minn!</h1>
        <h2>Veldu flokk til að byrja</h2>
        <ul>
          ${hlekkir}
        </ul>

          <footer>
          <a href="https://benjaminni.is/">fara á síðuna mína</a>
        </footer>
      </body>
    </html>
  `;
}

function geraFlokkHtml(data) {
  if (!data || !Array.isArray(data.questions)) {
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>Ógild gögn</title>
          <link rel="stylesheet" href="../../public/styles.css">
        </head>
        <body>
          <h1>Ógild gögn</h1>
          <p>Gögnin fyrir þennan flokk eru ógild og verður því ekki birt.</p>
        </body>
      </html>
    `;
  }

  const spurningHtml = data.questions
  .map((q) => {

    const answers = Array.isArray(q.answers) ? q.answers : [];
    const answersHtml = answers
    .map(
      (a) => `
        <li>
          ${a.answer}
        </li>
      `
    )
    .join('');

    return `
        <div>
          <h2>${q.question || 'Ógild spurning'}</h2>
          <ul>
            ${answersHtml}
          </ul>
        </div>
      `;
    })
    .join('');
    return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>${data.title || 'Flokkur'}</title>
        <link rel="stylesheet" href="../../public/styles.css">
      </head>
      <body>
        <h1>${data.title || 'Ónefndur flokkur'}</h1>
        ${spurningHtml}
      </body>
    </html>
  `;
}

async function main() {
  console.log('---vinna i þessu---');

  await fs.mkdir('dist', { recursive: true });

  const indexData = await readJson(INDEX_PATH);
  if (!Array.isArray(indexData)) {
    console.error('index.json is not an array. Check the file format.');
    return [];
  }
  const indexHtml = geraIndexHtml(indexData);
  await fs.writeFile(path.join('dist', 'index.html'), indexHtml, 'utf-8');

  for (const item of indexData) {

    if(!item.file){
      console.log('skippum þessu', item);
        continue;
    }

    const filePath = path.join('..', 'data', item.file);
    const content = await readJson(filePath);

    const html = geraFlokkHtml(content);

    const outFileName = item.file.replace('.json', '.html');

    await fs.writeFile(path.join('dist', outFileName), html, 'utf-8');
  }

  console.log('---klárað---');
}




main().catch((err) => {
  console.error('Villa', err);
});


/*
  // Read other JSON files listed in index.json
  const allData = await Promise.all(
    indexData.map(async (item) => {
      const filePath = `./data/${item.file}`;
      const fileData = await readJson(filePath);
      return fileData ? { ...item, content: fileData } : null;
    }),
  );


main();
 */
/*
// Eftirfarandi kóði kom frá ChatGTP eftir að hafa gefið
// MJÖG einfalt prompt ásamt allri verkefnalýsingu
async function readAllData() {
  const indexPath = './data/index.json';

  try {
    // Read index.json
    const indexData = await readJSON(indexPath);

    if (!Array.isArray(indexData)) {
      console.error('index.json is not an array. Check the file format.');
      return [];
    }

    // Read other JSON files listed in index.json
    const allData = await Promise.all(
      indexData.map(async (item) => {
        const filePath = `./data/${item.file}`;
        const fileData = await readJSON(filePath);
        return fileData ? { ...item, content: fileData } : null;
      }),
    );

    return allData.filter(Boolean); // Remove null entries if any file failed to load
  } catch (error) {
    console.error('Error reading data files:', error.message);
    return [];
  }
}


readAllData().then((data) => console.log(data))*/