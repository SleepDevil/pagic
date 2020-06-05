# Pagic

[![gh-pages](https://github.com/xcatliu/pagic/workflows/gh-pages/badge.svg)](https://github.com/xcatliu/pagic/actions)

The easiest way to generate static html page from markdown, built with Deno! 🦕

## Features

- [Markdown + Layout => HTML](#markdown--layout--html)
- [React component as a page](#react-component-as-a-page)
- [Copy static files](#copy-static-files)
- [Sub pages and layouts](#sub-pages-and-layouts)
- [Front matter](#front-matter)
- [Configuration](#configuration)
- [Plugins and themes](#plugins-and-themes)

WARNING: This project is under development so api would change without

## Live demo

- [TypeScript Tutorial](https://ts.xcatliu.com/) ([GitHub](https://github.com/xcatliu/typescript-tutorial/))

## Getting started

### Installation

```bash
# Install deno https://deno.land/#installation
curl -fsSL https://deno.land/x/install/install.sh | sh
# Install pagic
deno install --unstable --allow-read --allow-write --allow-net https://deno.land/x/pagic/mod.ts
```

### Markdown + Layout => HTML

Let's say we have a project like this:

```
docs/
├── public/
└── src/
    ├── _layout.tsx
    └── index.md
```

The `src/_layout.tsx` is a simple react component:

```tsx
// @deno-types="https://deno.land/x/types/react/v16.13.1/react.d.ts"
import React from 'https://dev.jspm.io/react@16.13.1';
import { PagicLayout } from 'https://deno.land/x/pagic/mod.ts';

const Layout: PagicLayout = ({ title, content }) => (
  <html>
    <head>
      <title>{title}</title>
      <meta charSet="utf-8" />
    </head>
    <body>{content}</body>
  </html>
);

export default Layout;
```

The `src/index.md` is a simple markdown file:

```md
# Pagic

The easiest way to generate static html page from markdown, built with Deno! 🦕
```

Then run:

```bash
pagic build
```

We'll get an `index.html` file in `public` directory:

```
docs/
├── public/
|   └── index.html
└── src/
    ├── _layout.tsx
    └── index.md
```

The content should be:

```html
<html>
  <head>
    <title>Pagic</title>
    <meta charset="utf-8" />
  </head>
  <body>
    <article>
      <h1 id="pagic">Pagic</h1>
      <p>The easiest way to generate static html page from markdown, built with Deno! 🦕</p>
    </article>
  </body>
</html>
```

### React component as a page

A react component can also be built to html:

```
docs/
├── public/
|   ├── index.html
|   └── hello.html
└── src/
    ├── _layout.tsx
    ├── index.md
    └── hello.tsx
```

Here we build `src/hello.tsx` to `public/hello.html`, using `src/_layout.tsx` as the layout.

`src/hello.tsx` is a simple react component:

```tsx
// @deno-types="https://deno.land/x/types/react/v16.13.1/react.d.ts"
import React from 'https://dev.jspm.io/react@16.13.1';

const Hello = () => <h1>Hello World</h1>;

export default Hello;
```

And `public/hello.html` would be:

```tsx
<html>
  <head>
    <title></title>
    <meta charset="utf-8" />
  </head>
  <body>
    <h1>Hello World</h1>
  </body>
</html>
```

### Copy static files

If there are other static files which are not ended with `.{md|tsx}` or start with `_`, we will simply copy them:

```
docs/
├── public/
|   ├── assets
|   |   └── index.css
|   ├── index.html
|   └── hello.html
└── src/
    ├── assets
    |   └── index.css
    ├── _layout.tsx
    ├── _partial.tsx
    ├── index.md
    └── hello.tsx
```

### Sub pages and layouts

We can have sub directory which contains markdown or component.

Sub directory can also have a `_layout.tsx` file.

For each markdown or react component, it will walk your file system looking for the nearest `_layout.tsx`. It starts from the current directory and then moves to the parent directory until it finds the `_layout.tsx`.

```
docs/
├── public/
|   ├── assets
|   |   └── index.css
|   ├── index.html
|   └── hello.html
|   └── sub
|       └── index.html
└── src/
    ├── assets
    |   └── index.css
    ├── _layout.tsx
    ├── _partial.tsx
    |── index.md
    └── sub
        ├── _layout.tsx
        └── index.md
```

### Front matter

Front matter allows us add extra meta data to markdown:

```markdown
---
author: xcatliu
published: 2020-05-20
---

# Pagic

The easiest way to generate static html page from markdown, built with Deno! 🦕
```

Every item in the front matter will pass to the `_layout.tsx` as the props:

```tsx
// @deno-types="https://deno.land/x/types/react/v16.13.1/react.d.ts"
import React from 'https://dev.jspm.io/react@16.13.1';
import { PagicLayout } from 'https://deno.land/x/pagic/mod.ts';

const Layout: PagicLayout = ({ title, content, author, published }) => (
  <html>
    <head>
      <title>{title}</title>
      <meta charSet="utf-8" />
    </head>
    <body>
      {content}
      <footer>
        Author: ${author}, Published: ${published}
      </footer>
    </body>
  </html>
);

export default Layout;
```

#### Front matter in react component

In react component we can export a `frontMatter` variable:

```tsx
// @deno-types="https://deno.land/x/types/react/v16.13.1/react.d.ts"
import React from 'https://dev.jspm.io/react@16.13.1';

const Hello = () => <h1>Hello World</h1>;

export default Hello;

export const frontMatter = {
  title: 'Hello World',
  author: 'xcatliu',
  published: '2020-05-20'
};
```

### Configuration

It's able to configurate pagic by adding a `pagic.config.ts` file. The default configuration is:

```ts
export default {
  srcDir: 'src',
  publicDir: 'public',
  // https://docs.npmjs.com/using-npm/developers.html#keeping-files-out-of-your-package
  ignore: [
    /\/\..+\.swp$/,
    /\/\._/,
    /\/\.DS_Store$/,
    /\/\.git\//,
    /\/\.hg\//,
    /\/\.npmrc$/,
    /\/\.lock-wscript$/,
    /\/\.svn\//,
    /\/\.wafpickle\-.+/,
    /\/config\.gypi$/,
    /\/CVS\//,
    /\/npm\-debug\.log$/,
    /\/node_modules\//
  ],
  plugins: ['init', 'md', 'tsx', 'layout', 'write'],
  watch: false,
  serve: false,
  port: 8000
};
```

Your `pagic.config.ts` will be **deep-merge** to the default config, that is, your `ignore` and `plugins` will be appended to default, not replace it.

### Plugins and themes

As you see there are five built-in plugins: `init`, `md`, `tsx`, `layout` and `write`.

We can add our own plugin by changing the plugins config in the `pagic.config.ts` file:

```ts
import myPlugin from './myPlugin.tsx';

export default {
  srcDir: 'site',
  plugins: [myPlugin]
};
```

To develop a `myPlugin` please checkout the [built-in plugins](https://github.com/xcatliu/pagic/tree/master/src/plugins).

Themes is under development, please come back later!

## Use pagic as cli

### `pagic build`

We can use `pagic build` to build static pages, there are some options while using `build` command:

```bash
pagic build [options]

# --watch  watch src dir change
# --serve  serve public dir
# --port   override default port
```

## LICENSE

[MIT](./LICENSE)

---

Have fun with pagic!
