import { describe, it, expect, vi } from 'vitest';
import { writeHtml } from '../src/lib/writeHtml.js';
import fs from 'node:fs/promises';
import path from 'node:path';

vi.mock('node:fs/promises');

describe('writeHtml', () => {
  it('writes index.html with provided categories', async () => {
    fs.mkdir.mockResolvedValue();
    fs.writeFile.mockResolvedValue();

    const categories = [
      { title: 'HTML', file: 'html.html' },
      { title: 'CSS', file: 'css.html' },
    ];

    await writeHtml(categories);

    expect(fs.mkdir).toHaveBeenCalledWith('dist', { recursive: true });

    const [writtenFilePath, writtenContent] = fs.writeFile.mock.calls[0];

    expect(writtenFilePath).toBe(path.join('dist', 'index.html'));

    expect(writtenContent).toContain('<li><a href="html.html">HTML</a></li>');
    expect(writtenContent).toContain('<li><a href="css.html">CSS</a></li>');
  });
});
