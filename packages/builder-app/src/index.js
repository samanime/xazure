import { basename } from 'path';
import { utils } from '@xazure/builder';

const source = 'src';
const dest = 'dist';

export default {
  source,
  dest,
  builders: [
    {
      name: 'config',
      matcher: path => ['config.js', 'config.private.js'].includes(basename(path)),
      builder: utils.js.privateBuilder(source, dest),
      restartOnChange: true
    }
  ]
};