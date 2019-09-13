import { createReadStream, createWriteStream } from "fs";
import { join, dirname, basename } from "path";
import { rimraf, mkdirp, makeMatcher } from '../utils';

export const matcher = path => makeMatcher(/^[^.]+$|\.(?!(js|css)$)([^.]+$)/)(path) && !/^\./.test(basename(path));

const copyFile = async (sourceFilePath, destinationFilePath) => {
  await mkdirp(dirname(destinationFilePath));
  return new Promise((resolve, reject) => {
    const readStream = createReadStream(sourceFilePath);
    const writeStream = createWriteStream(destinationFilePath);

    readStream.once('error', reject);
    writeStream.once('error', reject);
    readStream.once('end', resolve);

    readStream.pipe(writeStream);
  });
};

export const builder = (sourceDir, destinationDir) => rootDir => ({
  build: filePath => copyFile(join(rootDir, sourceDir, filePath), join(rootDir, destinationDir, filePath)),
  remove: filePath => rimraf(join(rootDir, destinationDir, filePath))
});