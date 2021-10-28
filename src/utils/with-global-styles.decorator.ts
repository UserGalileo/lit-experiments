import { html } from 'lit';

/**
 * This decorator appends global styles to each component's template.
 * Performance-wise, it's bad. It causes FOUC and it copies styles for each component.
 *
 * @example
 *
 * @withGlobalStyles()
 * render() { return html`...` }
 */
export function withGlobalStyles() {
  return function(_target: any, _propertyKey: string, descriptor: PropertyDescriptor): void {
    const render = descriptor.value;
    const styles = html`<style>@import "/src/assets/styles.css";</style>`;

    descriptor.value = function (...args: any[]) {
      return  html`${styles}${render.apply(this, args)}`
    }
  };
}
