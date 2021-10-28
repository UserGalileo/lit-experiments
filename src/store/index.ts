import { configureStore } from '@reduxjs/toolkit'
import { createStoreController } from '../utils/store.controller';

import { reducer as counterReducer } from './counter.store';

export const store = configureStore({
  reducer: {
    counter: counterReducer
  },
});
export type RootState = ReturnType<typeof store.getState>;
export const StoreController = createStoreController(store);

