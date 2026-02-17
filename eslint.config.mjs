import guidion from '@gdn/eslint-config-core';
import { globalIgnores } from 'eslint/config';

export default [
  globalIgnores(['dist/', 'coverage/']),
  ...guidion.configs.coreSet,
  ...guidion.configs.jestSet,
];
