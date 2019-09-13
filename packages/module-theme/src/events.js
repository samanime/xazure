export default ({ module: { path, theme: { styles = 'index.css' } } }) => ({
  replaceTemplateTag: async previous => {
    const args = await previous;
    const { module, tag, result, req } = args;
    const parts = tag.split(/\./);
    let obj;

    if (tag === 'theme.styles') {
      return Object.assign(args, { result: `${path}/theme/${styles}`.replace(/\/+/, '/') })
    }

    return args; // no changes
  },
  getRoutes: async previous => {
    const args = await previous;
    const { routes = {} } = args;

    return Object.assign(args, { routes: Object.assign(routes, {
      '/': ['home', 'index']
    }) });
  },
  getMenu: async previous => {
    const args = await previous;
    const { menuItems: current = [], name = 'default', req } = args;
    let menuItems;

    switch (name) {
      case 'default':
        menuItems = current.concat([
          { display: 'Home', url: path }
        ]);
        break;
    }

    return Object.assign(args, { menuItems });
  }
});