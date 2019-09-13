import Post from './components/Post';
import $common from './common';

Vue.prototype.$common = { };

export const templates = {
  'index': { template: '<div>Index</div>' },
  'post-post': Post,
  'post-page': { template: '<div>Page</div>' },
  'error404': { template: '<div>404 Error</div>' },
  'error': { template: '<div>Error</div>' }
};