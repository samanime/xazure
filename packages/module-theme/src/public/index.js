/* global Vue, VueRouter, modules */
import { templates } from './theme/index';
import $theme from './theme';

const defaultTemplate = { template: '<div>Base Error</div>' };

Promise.all([
  fetch(`${modules.theme.apiPath}/routes`.replace(/\/+/, '/')).then(r => r.json()),
  (async () =>
    Promise.all((await (await fetch(`${modules.theme.apiPath}/scripts`.replace(/\/+/, '/'))).json())
      .map(src => new Promise(resolve => document.body.appendChild(
        Object.assign(document.createElement('script'), { src, type: 'module', onload: resolve })
      )))
    )
  )(),
  new Promise(resolve => document.addEventListener("DOMContentLoaded", resolve))
]).then(([routeTemplates,,]) => {
  const routes = Object.entries(routeTemplates).reduce((routes, [path, templateNames]) =>
    routes.concat({
      path,
      props: true,
      component: templates[[].concat(templateNames).find(t => templates[t])] || templates.error || defaultTemplate
    }), []);

  const router = new VueRouter({
    base: '/',
    mode: 'history',
    routes
  });

  Vue.prototype.$theme = $theme;
  Object.entries(modules).forEach(([name, { helpers }]) => { helpers && (Vue.prototype[`\$${name}`] = helpers); });

  new Vue({
    router,
    render(h) { return h({ template: '<router-view></router-view>' }); }
  }).$mount('#app');
});