import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js';
import { PropertyValues } from '@lit/reactive-element';

@customElement('app-user')
export class UserComponent extends LitElement {

  @property() userId: string | null = null;

  override willUpdate(props: PropertyValues) {
    if (props.has('userId')) {
      console.log(`New userId: ${this.userId}, old userId: ${props.get('userId')}`);
    }
  }

  render() {
    return html`
        <h1>User ID: ${this.userId}<br></h1>
        
        <small>
          <b>This is a child route!</b><br>
          Notice that when we pass from one ID to the other, the component is not destroyed but only its properties change (look at the console)
        </small>
    `
  }
}
