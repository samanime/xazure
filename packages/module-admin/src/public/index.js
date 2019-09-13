/* global Vue, VueRouter, modules */
import App from './components/App';
import Dashboard from './components/Dashboard';

const routeManager = (() => {
  const router = new VueRouter({
    base: modules.admin.path,
    mode: 'history',
    linkActiveClass: '',
    linkExactActiveClass: 'active',
    routes: [{ path: '*', component: { template: '<div>Loading</div>' } }]
  });

  return {
    add: route => {
      router.addRoutes([].concat(route));
    },
    get: () => router
  };
})();

Object.assign(global, { routeManager });

routeManager.add({ path: '/', component: Dashboard });

Promise.all([
  ((async () => Promise.all((await (await fetch(`${modules.admin.apiPath}/scripts`, { credentials: 'same-origin' })).json())
    .map(src => new Promise(onload => document.body.appendChild(
      Object.assign(document.createElement('script'), { src, type: 'module', onload })
    ))
  )))()),
  new Promise(resolve => document.addEventListener("DOMContentLoaded", resolve))
]).then(() => {
  new Vue({
    router: routeManager.get(),
    render(h) { return h(App) }
  }).$mount('#app');
});