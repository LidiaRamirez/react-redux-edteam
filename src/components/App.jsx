import React from 'react';
import '../styles/styles.scss';
import AppRoute from './AppRoutes';
import { Provider } from 'react-redux'
import store from '../redux/store'

const App = () => (
  <Provider store={store}>
    <AppRoute />
  </Provider>
)

export default App;