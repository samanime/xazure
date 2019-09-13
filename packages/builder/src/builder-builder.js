import { js } from './utils';

const source = 'src';
const dest = 'dist';

export default {
  source,
  dest,
  builders: [
    { name: 'js', matcher: js.privateMatcher, builder: js.privateBuilder(source, dest), restartBuildsOnChange: true }
  ]
};