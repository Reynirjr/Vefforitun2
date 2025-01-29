import { describe, it, expect } from 'vitest';
import { geraFlokkHtml } from '../src/lib/generateHtml.js';

describe('geraFlokkHtml', () => {
  it('generates HTML with questions and answers', () => {
    const data = {
      title: 'Title',
      questions: [
        {
          question: 'Q1?',
          answers: [
            { answer: 'A1', correct: true },
            { answer: 'A2', correct: false },
          ],
        },
      ],
    };

    const html = geraFlokkHtml(data);

    expect(html).toContain('<h1>Title</h1>');
    expect(html).toContain('Q1?');
    expect(html).toContain('A1');
    expect(html).toContain('A2');
    expect(html).toContain('data-correct="true"');
    expect(html).toContain('data-correct="false"');
  });

  it('matches snapshot', () => {
    const data = {
      title: 'Snapshot Title',
      questions: [
        {
          question: 'Snapshot Q?',
          answers: [{ answer: 'Snapshot A1', correct: true }],
        },
      ],
    };
    const html = geraFlokkHtml(data);
    expect(html).toMatchSnapshot();
  });
});
