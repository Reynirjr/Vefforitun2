import fs from 'node:fs/promises';
import path from 'node:path';

const INDEX_PATH = './data/index.json';

/**
 * Les skrá og skilar gögnum eða null.
 * @param {string} filePath Skráin sem á að lesa
 * @returns {Promise<unknown | null>} Les skrá úr `filePath` og skilar innihaldi. Skilar `null` ef villa kom upp.
 */
async function readJson(filePath) {
  console.log('starting to read', filePath);
  let data;
  try {
    data = await fs.readFile(path.resolve(filePath), 'utf-8');
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return null;
  }

  try {
    const parsed = JSON.parse(data);
    return parsed;
  } catch (error) {
    console.error('error parsing data as json', error.message);
    return null;
  }
}

/**
 * Hjalpari sem stoppar html kóðann í spurningunum að verða 
 * að alvöru html kóða
 */
function stoppaHTML(str) {
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

/**
 * 
 * Tekur inn gögn um flokk og staðfestir að þau séu í réttu formi
 * Ef gögnin eru ekki í réttu formi skrifar fallið út villuskilaboð
 * 
 * skilar "staðfestu" object {title, question} eða null ef gögnin eru ekki í réttu formi
 *  
 */

function validateCategory(data) {

  if (!data || typeof data.title !== 'string' || !Array.isArray(data.questions)) {
    console.log('ógilt flokka data, sleppum:', data);
    return null;
  }
  
  const validQuestions = []

  for (const q of data.questions) {
    if (!q || typeof q.question !== 'string' || !Array.isArray(q.answers)) {
      console.log('ógild spurning, skippidy skippum:', q);
      continue;
    }

    const validAnswers = [];
    for (const a of q.answers) {
      if (!a || typeof a.answer !== 'string' || typeof a.correct !== 'boolean') {
        console.log('ogilt svar, sleppum:', a);
      } else {
        validAnswers.push(a);
      }
    }
      

    if (validAnswers.length > 0) {
      validQuestions.push({
        question: q.question,
        answers: validAnswers,
      });
    } else {
      console.log('engin lögleg svör í spurningunni:', q.question);
    }
  }
  if (validQuestions.length === 0) {
    console.log('engar gildar spurningar, sleppum flokki:', data.title);
    return null;
  }
  return {
    title: data.title,
    questions: validQuestions,
  };
    
}



  /**
 * Skrifar HTML fyrir flokk
 * @param {object} data staðfest gögn
 * @returns {string} HTML strengur sem við skrifum 
 */
  function geraFlokkHtml(data) {
    const questionsHtml = data.questions
      .map((q) => {
        const answersHtml = q.answers
          .map((a) => `<li>${stoppaHTML(a.answer)}</li>`)
          .join('');
  
        return /* html */ `
          <div class = "spurning">
            <h2>${stoppaHTML(q.question)}</h2>
            <ul>
              ${answersHtml}
            </ul>
          </div>
        `;
      })
      .join('');
  
    return /* html */ `
  <!DOCTYPE html>
  <html lang="is">
  <head>
    <meta charset="utf-8">
    <title>${data.title}</title>
    <link rel="stylesheet" href="../public/styles.css">
  </head>
  <body>
    <h1>${data.title}</h1>
    ${questionsHtml}
    <footer>
      <a href="www.benjaminni.is">Benjaminni.is</a>
    </footer>
  </body>
  </html>
    `;
  }


/**
 * Skrifa HTML fyrir yfirlit í index.html
 * @param {any} data Gögn til að skrifa
 * @returns {Promise<void>}
 */
async function writeHtml(indexData) {

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
        <h1>Verkefni 1 - Yfirlit</h1>
        <ul>
          ${listItems}
        </ul>
        <footer>
          <a href="www.benjaminni.is">Benjaminni.is</a>
        </footer>
      </body>
    </html>
      `;


      await fs.writeFile(htmlFilePath, htmlContent, 'utf8');
      console.log('Wrote overall index.html to', htmlFilePath);
}


/**
 * Les index.json
 * skrifar síðan dist/index.html
 * gerir síðan fyrir hvern gildan flokk html skrá í dist
 */
async function main() {
  const indexJson = await readJson(INDEX_PATH);
  if (!Array.isArray(indexJson)) {
    console.error('index.json er ekki á réttu formi (fylki)');
    return;
  }

  const validCategories = [];

  

  for (const item of indexJson) {
    if (!item.file) {
      console.log('Ekkert "file" í þessum flokk sleppum:', item);
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