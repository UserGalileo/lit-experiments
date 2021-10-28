import { LitElement } from 'lit';

type Constructor<T = {}> = new (...args: any[]) => T;

export interface ShadowlessInterface {
  createRenderRoot: () => HTMLElement;
}

/**
 * Removes Shadow DOM from a Custom Element.
 *
 * @example
 * class FooComponent extends Shadowless(LitElement)
 */
export const Shadowless = <T extends Constructor<LitElement>>(superClass: T) => {
  class ShadowlessElement extends superClass {
    createRenderRoot() {
      return this;
    }
  }
  return ShadowlessElement as Constructor<ShadowlessInterface> & T;
};
