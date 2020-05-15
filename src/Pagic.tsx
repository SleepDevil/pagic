/* eslint-disable @typescript-eslint/no-require-imports */
import path from 'path';
import fs from 'fs';
import fse from 'fs-extra';
import http from 'http';
import glob from 'glob';
import pify from 'pify';
import React from 'react';
import chokidar from 'chokidar';
import ecstatic from 'ecstatic';

export interface PagicConfig {
  srcDir: string;
  publicDir: string;
  plugins: ('md' | 'tsx' | 'layout' | 'prettier')[];
  watch: boolean;
  port: number;
  serve: boolean;
}

export type PagicLayout = React.FC<{
  title: string;
  content: React.ReactNode;
}>;

export interface PagicPluginCtx {
  config: PagicConfig;
  pagePath: string;
  layoutPath: string;
  outputPath: string;
  title: string;
  content: React.ReactNode;
}

export type PagicPlugin = (ctx: PagicPluginCtx) => {};

export default class Pagic {
  private config: PagicConfig = {
    srcDir: 'src',
    publicDir: 'public',
    plugins: ['md', 'tsx', 'layout', 'prettier'],
    watch: false,
    port: 8000,
    serve: false
  };
  private pagePaths: string[] = [];
  private layoutPaths: string[] = [];
  private staticPaths: string[] = [];

  public constructor() {
    const projectConfigPath = path.resolve(process.cwd(), 'pagic.config.js');
    if (!fs.existsSync(projectConfigPath)) {
      return;
    }

    const projectConfig = require(projectConfigPath).default;
    this.setConfig(projectConfig);
  }

  public setConfig(config: PagicConfig) {
    this.config = {
      ...this.config,
      ...config
    };
  }

  public async build() {
    await this.rebuild();

    if (this.config.watch) {
      const watcher = chokidar.watch('**/*', {
        cwd: this.config.srcDir
      });

      watcher.on('ready', () => {
        watcher
          .on('add', this.handleFileChange.bind(this))
          .on('change', this.handleFileChange.bind(this))
          .on('unlink', this.handleFileRemove.bind(this))
          .on('unlinkDir', this.rebuild.bind(this))
          .on('error', (error) => {
            console.error(`Watcher error: ${error.message}`);
          });
      });
    }
  }

  public async serve() {
    http.createServer(ecstatic({ root: this.config.publicDir })).listen(this.config.port);
    console.log(`Serve ${this.config.publicDir} on http://127.0.0.1:${this.config.port}/`);
  }

  private async rebuild() {
    console.log('Start rebuild');
    await this.clean();
    await this.glob();
    for (const pagePath of this.pagePaths) {
      await this.buildPage(pagePath);
    }
    for (const staticPath of this.staticPaths) {
      await this.copyStatic(staticPath);
    }
  }

  private async handleFileChange(filePath: string) {
    // layout changed
    if (/_[^\/]+\.tsx$/.test(filePath)) {
      await this.rebuild();
    }
    // page changed
    else if (/[^\/]+\.(md|tsx)$/.test(filePath)) {
      await this.buildPage(filePath);
    }
    // static file changed
    // prettier-ignore
    else if (/_[^\/]+$/.test(filePath) === false) {
      await this.copyStatic(filePath);
    }
  }

  private async handleFileRemove(filePath: string) {
    // layout removed
    if (/_[^\/]+\.tsx$/.test(filePath)) {
      await this.rebuild();
    }
    // page removed
    else if (/[^\/]+\.(md|tsx)$/.test(filePath)) {
      await fse.remove(this.getOutputPath(filePath));
    }
    // static file removed
    else if (/_[^\/]+$/.test(filePath) === false) {
      await fse.remove(path.resolve(this.config.publicDir, filePath));
    }
  }

  private async clean() {
    await fse.emptyDir(this.config.publicDir);
  }

  private async glob() {
    this.pagePaths = await pify(glob)(`**/*.{md,tsx}`, {
      nodir: true,
      cwd: this.config.srcDir,
      ignore: '**/_*'
    });
    this.layoutPaths = await pify(glob)(`**/_layout.tsx`, {
      nodir: true,
      cwd: this.config.srcDir
    });
    this.staticPaths = await pify(glob)(`**/*`, {
      nodir: true,
      cwd: this.config.srcDir,
      ignore: ['**/_*', '**/*.{md,tsx}']
    });
  }

  private async buildPage(pagePath: string) {
    let ctx: PagicPluginCtx = {
      config: this.config,
      pagePath,
      layoutPath: this.getLayoutPath(pagePath),
      outputPath: this.getOutputPath(pagePath),
      title: '',
      content: null
    };
    for (const pluginName of this.config.plugins) {
      ctx = await require(`./plugins/${pluginName}`).default(ctx);
    }

    if (typeof ctx.content !== 'string') {
      throw new Error('ctx.content is not a string');
    }

    await this.whiteFile(ctx.outputPath, ctx.content);
  }

  private getLayoutPath(pagePath: string) {
    let layoutPath = `/${pagePath}`.replace(/\/[^\/]+$/, '/_layout.tsx');
    while (layoutPath !== '/_layout.tsx') {
      if (this.layoutPaths.includes(layoutPath.slice(1))) {
        break;
      }
      layoutPath = layoutPath.replace(/\/[^\/]+\/[^\/]+$/, '/_layout.tsx');
    }
    layoutPath = layoutPath.slice(1);

    return layoutPath;
  }

  private getOutputPath(pagePath: string) {
    return pagePath.replace(/\.[^\.]+$/, '.html');
  }

  private async whiteFile(filePath: string, content: string) {
    const fullFilePath = path.resolve(this.config.publicDir, filePath);
    await fse.mkdirp(path.dirname(fullFilePath));
    await pify(fs.writeFile)(fullFilePath, content);
  }

  private async copyStatic(filePath: string) {
    const src = path.resolve(this.config.srcDir, filePath);
    const dest = path.resolve(this.config.publicDir, filePath);
    await fse.copyFile(src, dest);
  }
}
