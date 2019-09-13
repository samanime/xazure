/* global modules */
export default {
  async getMenu(name = '') {
    return (await (await fetch(`${modules.theme.apiPath}/menu/${name}`)).json());
  }
};