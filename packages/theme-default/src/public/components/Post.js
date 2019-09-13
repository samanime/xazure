import App from './App';

export default {
  async mounted() {
    Object.assign(this, await this.$posts.get(this.slug));
  },
  props: ['slug'],
  data: () => ({
    authorId: null,
    content: null,
    creationTime: null,
    publishTime: null,
    title: null,
    type: null,
    _id: null
  }),
  components: { app: App },
  template: `<app>
    <h1>{{title}}</h1>
    <div>{{content}}</div>
  </app>`
};