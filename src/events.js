import { findDotPath } from 'xazure-cms-utils';

export default ({ a, config }) => ({
  parseTemplate: async previous => {
    const args = await previous;
    const { module, text, req } = args;

    let matches = [];
    text.replace(/{{\s*([^\s}]*)\s*}}/g, (match, tag) => matches.push({ match, tag }));

    const replacements = await Promise.all(matches.map(async ({ match, tag }) => ({
      match: new RegExp(match, 'g'),
      replacement: (await a('replaceTemplateTag', { module, tag, result: tag, req })).result
    })));

    return Object.assign(args, { text: replacements.reduce((result, { match, replacement }) =>
        result.replace(match, replacement), text) });
  },
  replaceTemplateTag: async previous => {
    const args = await previous;
    const { module, tag, result, req } = args;
    const parts = tag.split(/\./);
    let obj;

    if (tag === 'modules') {
      return Object.assign(args, { result: `<script>
        const modules = ${JSON.stringify(
          config.modules.reduce((r, { path, publicPath, name, apiPath, public: publicConfig }) =>
            Object.assign(r, { [name]: { ...publicConfig, path, publicPath, apiPath } }), {}))};
        </script>`
      });
    } else if (parts[0] === 'root') {
      obj = config;
    } else if (parts[0] === 'module') {
      obj = module;
    }

    return Object.assign(args, obj && { result: findDotPath(obj, parts.slice(1)) });
  }
});