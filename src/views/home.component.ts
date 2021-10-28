import { LitElement, html, css } from 'lit'
import { customElement } from 'lit/decorators.js';
import { StoreController } from '../store';
import { actions, selectCounter } from '../store/counter.store'
import { withGlobalStyles } from '../utils/with-global-styles.decorator';

@customElement('app-home')
export class HomeComponent extends LitElement {

  static styles = css`
    small {
      display: block;
      margin-bottom: 2rem;
    }
  `

  private store = new StoreController(this, selectCounter);

  inc() {
    this.store.dispatch(actions.increment());
  }

  dec() {
    this.store.dispatch(actions.decrement());
  }

  reset() {
    this.store.dispatch(actions.set(0));
  }

  @withGlobalStyles()
  render() {
    return html`
      <h1>Counter: ${this.store.state}</h1>
      <small>This number is a global state (Redux), try navigating away and back.</small>
      
      <sl-button @click=${this.inc}>+</sl-button>
      <sl-button @click=${this.dec}>-</sl-button>
      <sl-button @click=${this.reset}>RESET</sl-button>
    `
  }
}
