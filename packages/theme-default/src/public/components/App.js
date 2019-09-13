import Header from './Header.js';
import Nav from './Nav.js';

export default {
  components: {
    'app-nav': Nav,
    'app-header': Header
  },
  template: `
    <div>
      <app-nav></app-nav>
      <slot></slot>
    </div>
  `
};