// // @deno-types="https://deno.land/x/types/react/v16.13.1/react.d.ts"
// import React from 'https://dev.jspm.io/react@16.13.1';

export default {
  srcDir: 'site',
  theme: 'docs',
  plugins: ['sidebar'],
  title: 'Pagic',
  description: 'The easiest way to generate static html page from markdown, built with Deno! 🦕',
  github: 'https://github.com/xcatliu/pagic',
  // head: (
  //   <>
  //     <script src="/assets/vconsole.min.js" />
  //     <script dangerouslySetInnerHTML={{ __html: 'var vConsole = new VConsole();' }} />
  //   </>
  // ),
  nav: [
    {
      text: '文档',
      link: '/docs/introduction.html'
    },
    {
      text: '主题',
      link: '/themes/'
    },
    {
      text: '插件',
      link: '/plugins/'
    },
    {
      text: '新闻',
      link: '/news/'
    },
    {
      text: '关于',
      link: '/about/'
    },
    {
      text: '示例',
      link: '/demos/',
      align: 'right'
    }
  ],
  sidebar: {
    '/docs/': [
      'docs/introduction.md',
      'docs/usage.md',
      'docs/configuration.md',
      'docs/content.md',
      'docs/layout.md',
      'docs/themes.md',
      'docs/plugins.md',
      'docs/deployment.md'
    ]
  }
};
