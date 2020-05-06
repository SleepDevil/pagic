import prettier from 'prettier';
import { PagicPlugin } from '../Pagic';

const prettierPlugin: PagicPlugin = (ctx) => {
  if (typeof ctx.content !== 'string') {
    return ctx;
  }
  const content = prettier.format(ctx.content, {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    ...require('../../.prettierrc').default,
    parser: 'html'
  });
  return {
    ...ctx,
    content
  };
};

export default prettierPlugin;
