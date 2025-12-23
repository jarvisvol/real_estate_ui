import React,{useEffect} from 'react';
import AppRouter from './AppRouter';
import { Provider } from 'react-redux';
import store from './Utils/store/store';
import feather from 'feather-icons';



export default function App() {
   useEffect(() => {
    feather.replace();
  }, []);
  return (
     <Provider store={store}>
      <div className="App">
        <AppRouter />
      </div>
    </Provider>
  );
}