import { describe, it, expect, vi } from 'vitest';
import { readJson } from '../src/lib/readJson';
import fs from 'node:fs/promises';
import path from 'node:path';

vi.mock('node:fs/promises');

describe('readJson', () => {
  it('should read and parse a valid JSON file', async () => {
    const filePath = 'valid.json';
    const fileContent = '{"key": "value"}';
    fs.readFile.mockResolvedValue(fileContent);

    const result = await readJson(filePath);

    expect(fs.readFile).toHaveBeenCalledWith(path.resolve(filePath), 'utf-8');
    expect(result).toEqual({ key: 'value' });
  });

  it('should return null if the file does not exist', async () => {
    const filePath = 'nonexistent.json';
    fs.readFile.mockRejectedValue(new Error('File not found'));

    const result = await readJson(filePath);

    expect(fs.readFile).toHaveBeenCalledWith(path.resolve(filePath), 'utf-8');
    expect(result).toBeNull();
  });

  it('should return null if the file content is not valid JSON', async () => {
    const filePath = 'invalid.json';
    const fileContent = 'invalid json';
    fs.readFile.mockResolvedValue(fileContent);

    const result = await readJson(filePath);

    expect(fs.readFile).toHaveBeenCalledWith(path.resolve(filePath), 'utf-8');
    expect(result).toBeNull();
  });
});
