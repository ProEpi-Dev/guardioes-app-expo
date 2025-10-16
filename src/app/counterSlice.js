import { createSlice } from '@reduxjs/toolkit';

// Define o estado inicial para este "slice"
const initialState = {
  value: 0,
};

export const counterSlice = createSlice({
  name: 'counter', // Nome do slice
  initialState,
  // Os reducers são as funções que manipulam o estado
  reducers: {
    // Action 'increment'
    increment: (state) => {
      // Com Redux Toolkit, você pode "mutar" o estado diretamente
      // por baixo dos panos, ele usa uma biblioteca chamada Immer para garantir a imutabilidade.
      state.value += 1;
    },
    // Action 'decrement'
    decrement: (state) => {
      state.value -= 1;
    },
  },
});

// Exporta as actions para serem usadas nos componentes
export const { increment, decrement } = counterSlice.actions;

// Exporta o reducer para ser usado na store
export default counterSlice.reducer;