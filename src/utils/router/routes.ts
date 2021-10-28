// Curtesy of SPELLiott (@techytacos) [modified]
import { TemplateResult } from 'lit';

export type RouteParams = Record<string, string>;
export type RouteRenderFn = (params: RouteParams) => TemplateResult | Promise<TemplateResult>;
export type RouteSetup = () => Promise<unknown>;

export interface ParsedRoute {
  matchingRenderFn: RouteRenderFn;
  matchingPath: string;
  setup?: RouteSetup;
  params: RouteParams;
}

export interface Route {
  path: string;
  render: RouteRenderFn;
  setup?: RouteSetup;
  children?: Route[];
}

export const parseURL = (
    newURL: URL,
    routes: Route[],
    basePath?: string,
): ParsedRoute | null => {
  let pathname = newURL.pathname;
  if (basePath !== undefined) {
    if (pathname.indexOf(basePath) === 0) {
      pathname = pathname.replace(basePath, '');
    } else {
      return null;
    }
  }
  const path = pathname;
  const pathParts = path.split('/');

  let matchingPath: string | null = null;
  let matchingRenderFn: RouteRenderFn | null = null;
  let setup: RouteSetup | undefined;
  let params: RouteParams = {};

  for (const route of routes) {
    let matchesPath = true;
    const routeParts = route.path.split('/');

    if (routeParts.length !== pathParts.length) {
      continue;
    }

    for (let i = 0; i < routeParts.length; i++) {
      const routePart = routeParts[i];
      const pathPart = pathParts[i];

      const paramName = parseVariable(routePart);

      // matches variable
      if (paramName) {
        if (!params) {
          params = {};
        }
        params[paramName] = pathPart;
        continue;
      }

      // matches path part
      if (routePart === pathPart) {
        continue;
      }

      // does not match route
      params = {};
      matchesPath = false;
      break;
    }

    if (matchesPath) {
      matchingPath = route.path;
      matchingRenderFn = route.render;
      setup = route.setup;
      break;
    }
  }

  if (matchingPath && matchingRenderFn) {
    return {
      matchingPath: matchingPath,
      matchingRenderFn: matchingRenderFn,
      setup,
      params,
    };
  }

  const errorPage = routes.find(r => r.path === '**');
  if (errorPage) {
    return {
      matchingPath: '**',
      matchingRenderFn: errorPage.render,
      setup: errorPage.setup,
      params: {},
    };
  }

  return null;
};

const parseVariable = (routePart: string): string | null => {
  const variableParts = routePart.split(':');
  if (variableParts.length === 1) {
    return null;
  }

  return variableParts[1];
};

/**
 * Flattens an array of Routes with children into an array of Routes with no children.
 */
export function flattenRoutes(routes: Route[], parentPath = ''): Route[] {
  let newRoutes: Route[] = [];

  for (const route of routes) {
    const { children, ...rest } = route;

    newRoutes.push({
      ...rest,
      path: parentPath + rest.path
    });

    if (Array.isArray(route.children)) {
      const childRoutes = flattenRoutes(route.children, rest.path);
      newRoutes.push(...childRoutes.map(r => ({ ...r, path: parentPath + r.path })));
    }
  }
  return newRoutes;
}
