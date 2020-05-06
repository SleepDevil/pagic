/* eslint-disable @typescript-eslint/no-require-imports */
import path from 'path';
import fs from 'fs';
import pify from 'pify';
import React from 'react';
import fm from 'front-matter';
import MarkdownIt from 'markdown-it';
import Prism from 'node-prismjs';
import { PagicPlugin } from '../Pagic';

const md = new MarkdownIt({
  html: true,
  highlight: (str, lang) => {
    const prismLang = Prism.languages[lang] || Prism.languages.autoit;
    const classNameLang = lang || 'autoit';
    return `<pre class="language-${classNameLang}"><code class="language-${classNameLang}">${Prism.highlight(
      str,
      prismLang
    )}</code></pre>`;
  },
  replaceLink: (link: string) => {
    if (/^https?:\/\//.test(link)) {
      return link;
    }
    if (/README\.md$/.test(link)) {
      return link.replace(/README\.md$/, 'index.html');
    }
    return link.replace(/\.md$/, '.html');
  }
} as any)
  .use(require('markdown-it-anchor'))
  .use(require('markdown-it-title'))
  .use(require('markdown-it-replace-link'));

const mdPlugin: PagicPlugin = async (ctx) => {
  if (!ctx.pagePath.endsWith('.md')) {
    return ctx;
  }

  let content = await pify(fs.readFile)(path.resolve(ctx.config.srcDir, ctx.pagePath), 'utf-8');
  const fmResult = fm(content);
  const frontMatter: any = fmResult.attributes;
  content = fmResult.body;

  /**
   * Use markdown-it-title to get the title of the page
   * https://github.com/valeriangalliat/markdown-it-title
   */
  const env: any = {};
  const htmlContent = md.render(content, env);

  return {
    ...ctx,
    layoutPath: frontMatter.layout ?? ctx.layoutPath,
    outputPath: ctx.outputPath.replace(/README\.html$/, 'index.html'),
    title: frontMatter.title ?? env.title,
    content: <article dangerouslySetInnerHTML={{ __html: htmlContent }} />
  };
};

export default mdPlugin;
