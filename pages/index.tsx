import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import {
  ActionType,
  initialState,
} from '../redux';

import { ApplicationStateReducer } from '../redux'

import Frame from '../components/frame';

const initial = initialState();
const store = createStore(ApplicationStateReducer, initial);

export default function App() {
  return (
    <Provider store={store}>
      <Frame/>
    </Provider>
  );
}
