/**
 * From your Web Component, call this.dispatchEvent(requestNavigation(url))
 * @param location The destination URL
 */
export function requestNavigation(location: string) {
  return new CustomEvent('request-nav', {
    detail: { location },
    bubbles: true,
    composed: true,
  })
}
