import { PackageManifest } from './types';

export const packages: PackageManifest[] = [
  {
    name: 'effect',
    display: 'useRequest',
    external: ['axios', 'lodash.debounce', 'lodash.throttle'],
    globals: {
      axios: 'axios',
    },
  },
  {
    name: 'shared',
    display: 'Shared utilities',
  },
];

export const activePackages = packages.filter((i) => !i.deprecated);
