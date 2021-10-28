import { ReactiveController, ReactiveControllerHost } from 'lit';
import { OutputSelector, Store, Unsubscribe } from '@reduxjs/toolkit';

type AnyFunction = (state: any) => any;
type Selector = OutputSelector<any, any, any> | AnyFunction;
type SelectorsDictionary = Record<string, Selector>;
type ExtractedSelector<OS> = OS extends OutputSelector<any, infer B, any> ? B : never;
type ExtractedState<T> = T extends Store<infer S, any> ? S : never;
type SlicesDictionary<SD> = { [K in keyof SD]: ExtractedSelector<SD[K]> };
type SliceOrDictionary<T> = T extends SelectorsDictionary ? SlicesDictionary<T> : ExtractedSelector<T>;
export type State<State, Selectors> = Selectors extends undefined ? ExtractedState<State> : SliceOrDictionary<Selectors>;

// Type Guard
function isSelector(x?: Selector | SelectorsDictionary): x is Selector {
  return !!x && {}.toString.call(x) === '[object Function]';
}

// Type Guard
function isDictionarySelector(x?: Selector | SelectorsDictionary): x is SelectorsDictionary {
  return !!x && {}.toString.call(x) !== '[object Function]';
}

/**
 * @description StoreController factory.
 * @param store A Redux Store
 *
 * @example All the store
 * store = new StoreController(this);
 *
 * @example A slice of store
 * users = new StoreController(this, selectUsers);
 *
 * @example A dictionary of slices of store
 * stores = new StoreController(this {
 *   users: selectUsers,
 *   counter: selectCounter
 * });
 */
export const createStoreController = <S extends Store>(store: S) => {
  return class StoreController<T extends Selector | SelectorsDictionary | undefined = undefined> implements ReactiveController {

    // Internals
    _unsubscribe: Unsubscribe | null = null;
    _host!: ReactiveControllerHost;
    _selectorOrDictionary: T | undefined = undefined;

    state!: State<S, T>;
    dispatch = store.dispatch;

    constructor(host: ReactiveControllerHost)
    constructor(host: ReactiveControllerHost, selectorOrDictionary: T)
    constructor(
        host: ReactiveControllerHost,
        selectorOrDictionary?: T
    ) {
      this._host = host;
      this._host.addController(this);
      this._selectorOrDictionary = selectorOrDictionary;

      if (isDictionarySelector(selectorOrDictionary)) {
        this.state = {} as any;
      }

      this.updateState();
    }

    hostConnected(): void {
      this._unsubscribe = store.subscribe(() => {
        this.updateState();
      });
    }

    hostDisconnected(): void {
      this._unsubscribe?.();
    }

    updateState(): void {
      let changed = false;
      if (isSelector(this._selectorOrDictionary)) {
        // A single selector was passed to the constructor
        const newState = this._selectorOrDictionary(store.getState());
        if (newState !== this.state) {
          this.state = newState;
          changed = true;
        }
      } else if (isDictionarySelector(this._selectorOrDictionary)) {
        // A dictionary of selectors was passed to the constructor
        for (const key of Object.keys(this._selectorOrDictionary)) {
          const newState = this._selectorOrDictionary[key](store.getState());
          if (newState !== this.state[key]) {
            this.state[key] = newState;
            changed = true;
          }
        }
      } else {
        // No selector was passed to the constructor
        const newState = store.getState();
        if (newState !== this.state) {
          this.state = newState;
          changed = true;
        }
      }
      if (changed) {
        this._host.requestUpdate();
      }
    }
  }
}
