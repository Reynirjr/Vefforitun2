import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Les skrá og skilar gögnum eða null.
 * @param {string} filePath Skráin sem á að lesa
 * @returns {Promise<unknown | null>} Les skrá úr `filePath` og skilar innihaldi. Skilar `null` ef villa kom upp.
 */
export async function readJson(filePath) {
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