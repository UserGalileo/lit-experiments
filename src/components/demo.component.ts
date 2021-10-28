import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js';

@customElement('app-demo')
export class DemoComponent extends LitElement {

  render() {
    return html`
      Demo
    `
  }
}
