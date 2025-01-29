import { describe, it, expect } from 'vitest';
import { validateCategory } from '../src/lib/validateCategory.js';

describe('validateCategory', () => {
  it('returns null if data is null or not an object', () => {
    expect(validateCategory(null)).toBeNull();
    expect(validateCategory(undefined)).toBeNull();
    expect(validateCategory('string')).toBeNull();
    expect(validateCategory(123)).toBeNull();
  });

  it('returns null if title is not a string or questions is not an array', () => {
    expect(validateCategory({})).toBeNull();
    expect(validateCategory({ title: 'Foo' })).toBeNull();
    expect(validateCategory({ title: 'Foo', questions: 'not-an-array' })).toBeNull();
  });

  it('filters out invalid questions or invalid answers', () => {
    const data = {
      title: 'My Category',
      questions: [
        {
          question: 'Q1?',
          answers: [
            { answer: 'A1', correct: true },
            { answer: 'A2', correct: false },
          ],
        },
        {
          question: 'Broken question',
        },
        {
          question: 'Q2?',
          answers: [
            { answer: 'A1', correct: 'not boolean' }, 
            { answer: 'A2', correct: true },
          ],
        },
      ],
    };

    const result = validateCategory(data);

    expect(result).not.toBeNull();

    expect(result.title).toBe('My Category');

    expect(result.questions).toHaveLength(2);

    const q1 = result.questions[0];
    expect(q1.question).toBe('Q1?');
    expect(q1.answers).toHaveLength(2);


    const q2 = result.questions[1];
    expect(q2.question).toBe('Q2?');
    expect(q2.answers).toHaveLength(1);
  });

  it('returns null if no valid questions remain', () => {
    const data = {
      title: 'Invalid data',
      questions: [
        { question: 'Q?', answers: [{ answer: 'A?', correct: 'not boolean' }] },
      ],
    };
    const result = validateCategory(data);
    expect(result).toBeNull();
  });
});
