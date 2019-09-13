import { createCopyBuilder, copyMatcher, cssMatcher, privateJsMatcher, publicJsMatcher,
  createPrivateJsBuilder, createCssBuilder, createPublicJsBuilder } from '@xazure/builder';

const source = 'src';
const dest = 'dist';

export default {
  source,
  dest,
  builders: []
};