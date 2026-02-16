import guidion from '@gdn/eslint-config-core';
import { globalIgnores } from 'eslint/config';

export default [
  globalIgnores(['dist/']),
  ...guidion.configs.coreSet,
  ...guidion.configs.jestSet,
];
