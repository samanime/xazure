import { utils } from '@xazure/builder';

const { js, css, copy } = utils;

const source = 'src';
const dest = 'dist';

export default {
  source,
  dest,
  builders: [
    { name: 'privateJs', matcher: js.privateMatcher, builder: js.privateBuilder(source, dest), restartOnChange: true },
    { name: 'publicJs', matcher: js.publicMatcher, builder: js.publicBuilder(source, dest) },
    { name: 'css', matcher: css.matcher, builder: css.builder(source, dest) },
    { name: 'copy', matcher: copy.matcher, builder: copy.builder(source, dest) }
  ]
};