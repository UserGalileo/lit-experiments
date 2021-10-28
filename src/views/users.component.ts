import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js';

@customElement('app-users')
export class UsersComponent extends LitElement {

  render() {
    return html`
        <h1>Users</h1>
        
        <small>
          <b>All routes are lazy loaded!</b><br>
          Check the Networks tab while navigating for the first time.
        </small>
      `
  }
}
