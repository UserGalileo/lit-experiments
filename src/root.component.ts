import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js';
import { routes } from './routes';
import { Shadowless } from './utils/shadowless';
import { RouterController } from './utils/router';

@customElement('app-root')
export class RootComponent extends Shadowless(LitElement) {

  private router = new RouterController(this, { routes })

  render() {
    return html`
      <sl-button-group>
        <a href="/"><sl-button>Home</sl-button></a>
        <a href="/users"><sl-button>Users</sl-button></a>
        <a href="/users/1"><sl-button>User 1</sl-button></a>
        <a href="/users/2"><sl-button>User 2</sl-button></a>
      </sl-button-group>
      <hr>
      ${this.router.outlet}
    `
  }
}
