/* global modules */

export default async () => {
  const rootRegex = new RegExp(`^${modules.admin.path}`);

  const items = await (await fetch(`${modules.admin.apiPath}/nav-items`, { credentials: 'same-origin' })).json();

  const methods = {
    isAdminPath(path) { return rootRegex.test(path) },
    getAdminPath(path) { return path.replace(rootRegex, '') || '/' }
  };

  const data = () => ({ items });

  const template = `
    <div class="app-nav">
      <ul class="list-group">
        <li v-for="{ url, display } in items">
            <router-link class="list-group-item list-group-item-action" v-if="isAdminPath(url)" :to="getAdminPath(url)">{{ display }}</router-link>
            <a class="list-group-item list-group-item-action" v-else :href="url">{{ display }}</a>
        </li>
      </ul>
    </div>
`;

  return { template, data, methods };
};