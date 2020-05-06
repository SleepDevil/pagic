import path from 'path';
import React from 'react';
import { PagicPlugin } from '../Pagic';

const markdown: PagicPlugin = async (ctx) => {
  if (!ctx.pagePath.endsWith('.tsx')) {
    return ctx;
  }

  const fullPagePath = path.resolve(ctx.config.srcDir, ctx.pagePath);
  delete require.cache[require.resolve(fullPagePath)];
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const ContentComponent = require(fullPagePath).default;

  return {
    ...ctx,
    title: ContentComponent.title,
    content: <ContentComponent />
  };
};

export default markdown;
