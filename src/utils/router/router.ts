// Curtesy of SPELLiott (@techytacos) [modified]
import { TemplateResult } from 'lit';
import { ParsedRoute, parseURL, Route, flattenRoutes } from './routes';

export type BeforeNavCallback = (location: Location, parsedPath: ParsedRoute|null, eventTrigger: Event|null) => Promise<boolean>;
export type AfterNavCallback = (location: Location, parsedPath: ParsedRoute|null, eventTrigger: Event|null) => unknown;
let routerInstalled = false;

export class Router {
  beforeNav: BeforeNavCallback;
  afterNav: AfterNavCallback;
  basePath: string | undefined;
  routes: Route[];

  private uninstallRouter: Function | undefined;
  private _viewTemplate: TemplateResult | undefined;

  get viewTemplate() {
    return this._viewTemplate;
  }

  constructor(opts?: {basePath?: string, routes?: Route[], beforeNav?: BeforeNavCallback, afterNav?: AfterNavCallback}) {
    this.beforeNav = opts?.beforeNav ?? (() => Promise.resolve(true));
    this.afterNav = opts?.afterNav ?? (() => {});
    this.routes = opts?.routes ? flattenRoutes(opts?.routes) : [];
    this.basePath = opts?.basePath;
  }

  init() {
    this.uninstallRouter = installRouter(this.onNavigation.bind(this));
  }

  destroy() {
    this.uninstallRouter?.();
  }

  private async onNavigation(newURL: URL, clickEvent: Event|null) {
    const parsedRoute = parseURL(newURL, this.routes, this.basePath);
    const shouldNav = await this.beforeNav(location, parsedRoute, clickEvent);

    if (!shouldNav || !parsedRoute) {
      return;
    }

    // this is false in popstate
    if (window.location.href !== newURL.href) {
      window.history.pushState({}, '', newURL.href);
    }

    await parsedRoute.setup?.();
    this._viewTemplate = await parsedRoute.matchingRenderFn(parsedRoute.params);
    this.afterNav(location, parsedRoute, clickEvent);
  }

  requestNav(newLocation: string, eventTrigger?: Event|null) {
    this.onNavigation(new URL(newLocation, window.location.href), eventTrigger ?? null);
  }
}

const installRouter = (locationUpdatedCallback: (location:URL, event: Event|null) => void) => {
  if (routerInstalled) return;

  const handleClick = (e: MouseEvent) => {
    if (e.defaultPrevented || e.button !== 0 ||
        e.metaKey || e.ctrlKey || e.shiftKey) return;

    const anchor = e.composedPath().filter(
        n => (n as HTMLElement).tagName === 'A'
    )[0] as HTMLAnchorElement | undefined;
    if (!anchor || anchor.target ||
        anchor.hasAttribute('download') ||
        anchor.getAttribute('rel') === 'external') return;

    const href = anchor.href;
    if (!href || href.indexOf('mailto:') !== -1) return;

    const location = window.location;
    const origin = location.origin || `${location.protocol}//${location.host}`;

    if (href.indexOf(origin) !== 0) return;

    e.preventDefault();
    if (href !== location.href) {
      locationUpdatedCallback(new URL(href), e);
    }
  }

  const handlePopState = (e: PopStateEvent) => locationUpdatedCallback(new URL(window.location.href), e);

  document.body.addEventListener('click', handleClick);
  window.addEventListener('popstate', handlePopState);

  locationUpdatedCallback(new URL(window.location.href), null /* event */);
  routerInstalled = true;

  return () => {
    document.body.removeEventListener('click', handleClick);
    window.removeEventListener('popstate', handlePopState);
    routerInstalled = false;
  }
};
