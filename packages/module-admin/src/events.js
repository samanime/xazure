export default ({ a, module: { path, publicPath } }) => ({
  getAdminStyles: async previous => {
    const args = await previous;
    const { styles = [], req } = args;
    return Object.assign(args, { styles: styles.concat(`${publicPath}/index.css`)})
  },
  getAdminNavItems: Object.assign(async previous => {
    const args = await previous;
    const { navItems = [], req } = args;

    return Object.assign(args, { navItems: navItems.concat([
      { display: 'Home', url: '/' },
      { display: 'Dashboard', url: `${path}`.replace(/\/+/g, '/') }
    ])});
  }, { priority: 0 }),
  replaceTemplateTag: async previous => {
    const args = await previous;
    const { module, tag, result: current, req } = args;
    let result;

    if (tag === 'adminScripts') {
      result = (await a('getAdminScripts', { req, scripts: [] })).scripts
        .map(script => `<script src="${script}"${script.module ? ' type="module"' : ''}></script>`).join('\n');
    } else if (tag === 'adminStyles') {
      result = (await a('getAdminStyles', { req, styles: [] })).styles
        .map(style => `<link rel="stylesheet" href="${style}" />`).join('\n')
    }

    return Object.assign(args, result && { result });
  }
});