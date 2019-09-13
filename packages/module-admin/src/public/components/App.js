import Nav from './Nav';

export default {
  components: { 'app-nav': Nav },
  template: `
    <div class="container-fluid p-0 h-100">
      <div class="row h-100 no-gutters">
        <app-nav class="col-md-3 col-lg-2 h-100 bg-light"></app-nav>
        <router-view class="col-md-9 col-lg-10 px-3"></router-view>
      </div>
    </div>
  `
}