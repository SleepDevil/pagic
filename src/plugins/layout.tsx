import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { PagicPlugin } from '../Pagic';

const layout: PagicPlugin = (ctx) => {
  const fullLayoutPath = path.resolve(ctx.config.srcDir, ctx.layoutPath);
  delete require.cache[require.resolve(fullLayoutPath)];
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Layout = require(fullLayoutPath).default;
  return {
    ...ctx,
    content: ReactDOMServer.renderToStaticMarkup(<Layout title={ctx.title} content={ctx.content} />)
  };
};

export default layout;
