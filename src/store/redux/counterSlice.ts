import {createSlice} from '@reduxjs/toolkit';
const counterSlice = createSlice({name: 'counter', initialState: {value: 0}, reducers: {
  increment: state => {state.value++;},
  decrement: state => {state.value--;},
  resetCounter: state => {state.value = 0;},
}});
export const {increment, decrement, resetCounter} = counterSlice.actions;
export default counterSlice.reducer;
