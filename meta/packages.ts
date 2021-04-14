import { PackageManifest } from './types';

export const packages: PackageManifest[] = [
  {
    name: 'async',
    display: 'useRequest',
    external: ['axios'],
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
