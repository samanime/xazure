import { utils } from '@xazure/builder';

const source = 'src';
const dest = 'dist';

export default {
  source,
  dest,
  builders: [
    {
      name: 'js',
      matcher: utils.js.privateMatcher,
      builder: utils.js.privateBuilder(source, dest), restartOnChange: true
    }
  ]
};