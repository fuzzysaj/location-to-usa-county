import * as fs from 'fs';
import * as zlib from 'zlib';

/**
 * Asynchronously loads and parses a gzipped JSON file.
 * @param filePath Full name of gzipped text file containing valid a valid JSON object
 * @returns parsed JSON object
 */
export const gzToJson = async filePath => {
  const fileStream = fs.createReadStream(filePath);
  const gunzip = zlib.createGunzip();
  async function* chunksToJson(iterable) {
    let buf = '';
    for await (const chunk of iterable) buf += chunk;
    yield JSON.parse(buf);
  }
  const { value } = await chunksToJson(fileStream.pipe(gunzip)).next();
  return value;
}