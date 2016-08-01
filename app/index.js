import React from 'react';
import { render } from 'react-dom';
import Home from './components/Home';
import './app.global.css';
import './store';

render(
  <Home />,
  document.getElementById('root')
);
