import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './index';

export type CounterState = number;

const initialState: CounterState = 0;

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => state + 1,
    decrement: (state) => state - 1,
    set: (_, action: PayloadAction<number>) => action.payload
  },
});
export const actions = counterSlice.actions;
export const reducer = counterSlice.reducer;

// Selectors
export const selectCounter = (state: RootState) => state.counter;
export const selectDoubleCounter = createSelector(
    selectCounter,
    counter => counter * 2
)
