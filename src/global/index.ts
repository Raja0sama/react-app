import AppReducers from './reducers/app';
import {configureStore} from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    app: AppReducers,
  },
});
export type AppDispatch = typeof store.dispatch;
export default store;
