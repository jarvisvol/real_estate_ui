import React from 'react';
import AppRouter from './AppRouter';
import { Provider } from 'react-redux';
import store from './Utils/store/store';

export default function App() {
  return (
     <Provider store={store}>
      <div className="App">
        <AppRouter />
      </div>
    </Provider>
  );
}