import { join } from "path";
import postCssBase from 'postcss';
import postCssNext from 'postcss-cssnext';
import postCssImport from 'postcss-import';
import postCssNested from 'postcss-nested';
import { writeFile, mkdirp, readFile, rimraf, makeMatcher } from '../utils';

const postCssDefaultPlugins = {
  cssnext: postCssNext(),
  import: postCssImport(),
  nested: postCssNested()
};

export const matcher = makeMatcher(/\.css$/);

const buildPostCssPlugins = (defaultPlugins, { plugins = [], disable = [] } = {}) => [].concat(
  Object.entries(defaultPlugins).filter(([name, ]) => !disable.includes(name)).map(([, plugin]) => plugin)
).concat(plugins);

const buildPostCss = postCssConfig => postCssBase(buildPostCssPlugins(postCssDefaultPlugins, postCssConfig));

const buildCssFile = async (rootDir, sourceDir, destinationDir, file, postCss) => {
  const { css, map } = await postCss.process(await readFile(join(rootDir, sourceDir, file)),
    { from: join(sourceDir, file), to: join(destinationDir, file) });

  await mkdirp(join(rootDir, destinationDir));
  await Promise.all([
    writeFile(join(rootDir, destinationDir, file), css + `\n/*# sourceMappingURL=${file.map} */`),
    writeFile(join(rootDir, destinationDir, `${file}.map`), map)
  ]);
};

export const builder = (sourceDir, destinationDir) => (rootDir, { postCss: postCssConfig = {} } = {}) => {
  const postCss = buildPostCss(postCssConfig);

  return {
    build: filePath => buildCssFile(rootDir, sourceDir, destinationDir, filePath, postCss),
    remove: filePath => Promise.all([
      rimraf(join(rootDir, destinationDir, filePath)),
      rimraf(join(rootDir, destinationDir, `${filePath}.map`))
    ])
  };
};