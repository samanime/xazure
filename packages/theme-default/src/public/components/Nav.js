/* global modules */
export default async () => ({
  async mounted() {
    this.items = await this.$theme.getMenu();
    console.log(this.items);
  },
  data: () => ({
    items: []
  }),
  template: `
    <div class="nav">
      Nav
      <ul>
        <li v-for="{ url, display } in items">
          <router-link :to="url">{{ display }}</router-link>
        </li>
      </ul>
    </div>
  `
});