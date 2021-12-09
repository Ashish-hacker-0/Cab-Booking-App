import {configureStore,createStore} from '@reduxjs/toolkit';
import mainReducer from './slices';

export const store = createStore(mainReducer);