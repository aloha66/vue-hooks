import type { UserConfig } from 'vitepress'

const categoriesOrder = [
  'Browser',
  'Sensors',
  'Animation',
  'State',
  'Component',
  'Watch',
  'Formatters',
  'Utilities',
  'Misc',
]

const Guide = [
  { text: 'Getting Started', link: '/guide/index' },
  { text: 'Best Practice', link: '/guide/best-practice' },
  { text: 'Configurations', link: '/guide/config' },
  { text: 'Components', link: '/guide/components' },
  { text: 'Contributing', link: '/contributing' },
  { text: 'Guidelines', link: '/guidelines' },
]

const Functions = [
  { text: 'Animation', link: '/functions#animation' },
  { text: 'Browser', link: '/functions#browser' },
  { text: 'Component', link: '/functions#component' },
  { text: 'Formatters', link: '/functions#formatters' },
  { text: 'Misc', link: '/functions#misc' },
  { text: 'Sensors', link: '/functions#sensors' },
  { text: 'State', link: '/functions#state' },
  { text: 'Utilities', link: '/functions#utilities' },
  { text: 'Watch', link: '/functions#watch' },
]

const DefaultSideBar = [
  { text: 'Guide', children: Guide },
  { text: 'Core Functions', children: Functions },
  { text: 'Add-ons', link: '/add-ons' },
  { text: 'Ecosystem', link: '/ecosystem' },
  { text: 'Export Size', link: '/export-size' },
  { text: 'Recently Updated', link: '/recently-updated' },
]

const useRequest = [
  { text: '快速上手', link: '/hooks/effect/useRequest/doc/' },
  { text: '基础用法', link: '/hooks/effect/useRequest/doc/basic' },
  { text: 'Loading Delay', link: '/hooks/effect/useRequest/doc/loadingDelay' },
  { text: '依赖刷新', link: '/hooks/effect/useRequest/doc/refreshDeps' },
  { text: '错误重试', link: '/hooks/effect/useRequest/doc/retry' },
  { text: '节流', link: '/hooks/effect/useRequest/doc/throttle' },
  { text: '防抖', link: '/hooks/effect/useRequest/doc/debounce' },
  { text: '轮询', link: '/hooks/effect/useRequest/doc/polling' },
  {
    text: '屏幕聚焦重新请求',
    link: '/hooks/effect/useRequest/doc/refreshOnWindowFocus',
  },
  { text: '缓存 & SWR', link: '/hooks/effect/useRequest/doc/cache' },
]

const Effect = [
  {
    text: 'useRequest',
    // link: '/hooks/effect/useRequest/doc/',
    children: useRequest,
  },
]

const EffectSideBar = [{ text: 'effect', children: Effect }]

const UseRequestSideBar = [{ text: 'useRequest', children: useRequest }]
const FunctionsSideBar = getFunctionsSideBar()

const config: UserConfig = {
  title: 'VueUse',
  description: 'Collection of essential Vue Composition Utilities',
  lang: 'en-US',
  themeConfig: {
    logo: '/favicon.svg',
    repo: 'vueuse/vueuse',
    docsDir: 'packages',
    editLinks: true,
    editLinkText: 'Edit this page',
    lastUpdated: 'Last Updated',
    nav: [
      // { text: 'Home', link: '/' },s
      {
        text: 'Guide',
        items: Guide,
      },

      {
        text: 'Add-ons',
        link: '/add-ons',
      },
      {
        text: 'More',
        items: [
          { text: 'Playground', link: 'https://play.vueuse.org' },
          { text: 'Ecosystem', link: '/ecosystem' },
          { text: 'Export Size', link: '/export-size' },
        ],
      },
    ],
    sidebar: {
      '/guide/': DefaultSideBar,
      '/contributing': DefaultSideBar,
      '/add-ons': DefaultSideBar,
      '/ecosystem': DefaultSideBar,
      '/guidelines': DefaultSideBar,
      '/export-size': DefaultSideBar,
      '/recently-updated': DefaultSideBar,

      '/hook': UseRequestSideBar,
      '/functions': FunctionsSideBar,
      '/core/': FunctionsSideBar,
      '/shared/': FunctionsSideBar,
      '/router/': FunctionsSideBar,
      '/electron/': FunctionsSideBar,
      '/rxjs/': FunctionsSideBar,
      '/integrations/': FunctionsSideBar,
      '/firebase/': FunctionsSideBar,
    },
    algolia: {
      appId: 'NBQWY48OOR',
      apiKey: 'c5fd82eb1100c2110c1690e0756d8ba5',
      indexName: 'vueuse',
    },
  },
  head: [
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    ['link', { rel: 'icon', href: '/favicon-32x32.png', type: 'image/png' }],
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'author', content: 'Anthony Fu' }],
    ['meta', { property: 'og:title', content: 'VueUse' }],
    ['meta', { property: 'og:image', content: 'https://vueuse.org/og.png' }],
    [
      'meta',
      {
        property: 'og:description',
        content: 'Collection of essential Vue Composition Utilities',
      },
    ],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:creator', content: '@antfu7' }],
    ['meta', { name: 'twitter:image', content: 'https://vueuse.org/og.png' }],

    ['link', { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' }],
    [
      'link',
      {
        rel: 'preconnect',
        crossorigin: 'anonymous',
        href: 'https://fonts.gstatic.com',
      },
    ],
    [
      'link',
      {
        href: 'https://fonts.googleapis.com/css2?family=Fira+Code&display=swap',
        rel: 'stylesheet',
      },
    ],
  ],
}

function getFunctionsSideBar() {
  const links = []

  return links
}

export default config
