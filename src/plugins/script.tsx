import * as fs from 'https://deno.land/std@0.56.0/fs/mod.ts';
import * as path from 'https://deno.land/std@0.56.0/path/mod.ts';
import * as ts from 'https://dev.jspm.io/typescript@3.9.3';

// @deno-types="https://deno.land/x/types/react/v16.13.1/react.d.ts"
import React from 'https://dev.jspm.io/react@16.13.1';
import { PagicPlugin } from '../Pagic.ts';

const script: PagicPlugin = async (pagic) => {
  for (const pagePath of pagic.pagePaths) {
    const pageProps = pagic.pagePropsMap[pagePath];

    const scriptPath = path.resolve(pagic.config.publicDir, pageProps.outputPath.replace(/\.html$/, '_content.js'));
    await fs.ensureDir(path.dirname(scriptPath));

    if (pagePath.endsWith('.md')) {
      await fs.writeFileStr(
        scriptPath,
        `import React from 'https://dev.jspm.io/react@16.13.1';
export default function() {
  return React.createElement('article', {
    dangerouslySetInnerHTML: {
      __html: \`${pageProps.htmlContent}\`
    }
  })
};
`
      );
    } else if (pagePath.endsWith('.tsx')) {
      const pageContent = await fs.readFileStr(path.resolve(pagic.config.srcDir, pagePath));
      await fs.writeFileStr(
        scriptPath,
        ts.default.transpileModule(pageContent, {
          compilerOptions: {
            module: ts.default.ModuleKind.ESNext,
            jsx: 'React'
          }
        }).outputText
      );
    }

    pagic.pagePropsMap[pagePath] = {
      ...pageProps,
      script: <script type="module" src="/main.js" />
    };
  }
};

export default script;
