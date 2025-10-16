import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counterSlice'; // Importa o reducer que criamos

export const store = configureStore({
  reducer: {
    // Aqui registramos todos os reducers da nossa aplicação
    // A chave 'counter' será como acessaremos o estado deste slice
    counter: counterReducer,
  },
});