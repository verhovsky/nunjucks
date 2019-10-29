'use strict';

import * as lib from '@nunjucks/common';
import * as compiler from '@nunjucks/compiler';
import {lexer, parser, nodes} from '@nunjucks/parser';
import runtime from '@nunjucks/runtime';

import {Environment, Template} from './environment';
import {Loader} from './loader';
import {PrecompiledLoader, WebLoader} from './web-loaders';
import installJinjaCompat from './jinja-compat';

// A single instance of an environment, since this is so commonly used
let e;

function configure(templatesPath, opts) {
  opts = opts || {};
  if (lib.isObject(templatesPath)) {
    opts = templatesPath;
    templatesPath = null;
  }

  const TemplateLoader = new WebLoader(templatesPath, {
    useCache: opts.web && opts.web.useCache,
    async: opts.web && opts.web.async
  });

  e = new Environment(TemplateLoader, opts);

  return e;
}

export {
  Environment,
  Template,
  Loader,
  PrecompiledLoader,
  WebLoader,
  compiler,
  parser,
  lexer,
  runtime,
  lib,
  nodes,
  installJinjaCompat,
  configure,
};
export function reset() {
  e = undefined;
}
export function compile(src, env, path, eagerCompile) {
  if (!e) {
    configure();
  }
  return new Template(src, env, path, eagerCompile);
}
export function render(name, ctx, cb) {
  if (!e) {
    configure();
  }

  return e.render(name, ctx, cb);
}
export function renderString(src, ctx, cb) {
  if (!e) {
    configure();
  }

  return e.renderString(src, ctx, cb);
}

export * from './precompile';
