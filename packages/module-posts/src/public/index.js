/* global modules */
/**
 * @memberOf Vue.prototype
 */
const $posts = {
  async get(slug) {
    return (await (await fetch(`${modules.posts.apiPath}/slug/${slug}`)).json());
  }
};

modules.posts.helpers = $posts;