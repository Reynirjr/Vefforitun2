
  import { stoppaHTML } from './stoppaHtml.js';
  
  /**
 * Skrifar HTML fyrir flokk
 * @param {object} data staðfest gögn
 * @returns {string} HTML strengur sem við skrifum 
 */
 export function geraFlokkHtml(data) {
    const questionsHtml = data.questions
      .map((q) => {
        const answersHtml = q.answers
          .map((a) => `
          <li> 
            <button 
              class= "answer"
              data-correct="${a.correct}"
            >
            ${stoppaHTML(a.answer)}
            </button>
          </li>`
          )
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
    <link rel="stylesheet" href="./styles.css">
  </head>
  <body>
    <h1>${data.title}</h1>
    ${questionsHtml}
    <footer>
      <a href="./index.html">Aftur á forsíðu</a>
    </footer>
      <script>
        document.addEventListener('DOMContentLoaded', () => {
          const answerButtons = document.querySelectorAll('.answer');

          answerButtons.forEach((btn) => {
            btn.addEventListener('click', (e) => {
              const isCorrect = e.currentTarget.dataset.correct === 'true';
              if (isCorrect) {
                e.currentTarget.classList.add('correct');
              } else {
                e.currentTarget.classList.add('wrong');
              }
            });
          });
        });
      </script>
  </body>
  </html>
    `;
  }