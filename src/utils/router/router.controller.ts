import { ReactiveController, ReactiveControllerHost, html } from 'lit';
import { AfterNavCallback, BeforeNavCallback, Router } from './router';
import { Route } from './routes';

export class RouterController implements ReactiveController {

  private router: Router | null = null;

  get outlet() {
    return html`
      <div @request-nav="${(e: CustomEvent) => this.router?.requestNav(e.detail.location)}">
        ${this.router?.viewTemplate}
      </div>
    `;
  }

  constructor(
      private host: ReactiveControllerHost,
      private opts?: {basePath?: string, routes?: Route[], beforeNav?: BeforeNavCallback, afterNav?: AfterNavCallback}
  ) {
    this.host.addController(this);
  }

  hostConnected() {
    this.router = new Router({
      ...this.opts,
      afterNav: (...args) => {
        // Notifies the Host component so that the
        // outlet getter gets called again with the new template.
        this.host.requestUpdate();
        return this.opts?.afterNav?.(...args);
      }
    });
    this.router.init();
  }

  hostDisconnected() {
    this.router?.destroy();
  }
}
