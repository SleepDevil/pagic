import React from 'react';
import { PagicLayout } from 'pagic';

const Layout: PagicLayout = ({ title, content }) => (
  <html>
    <head>
      <title>{title}</title>
      <meta charSet="utf-8" />
    </head>
    <body>
      <aside>
        <nav>
          <ul>
            <li />
          </ul>
        </nav>
      </aside>
      <section>{content}</section>
    </body>
  </html>
);

export default Layout;
