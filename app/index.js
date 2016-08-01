import React from 'react';
import { render } from 'react-dom';
import DropArea from './components/DropArea';
import Home from './components/Home';
import List from './components/List';
import './app.global.css';
import './store';

render(
  <DropArea>
    <Home />
    <List />
  </DropArea>,
  document.getElementById('root')
);
