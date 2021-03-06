import 'normalize.css';

import React from 'react';
import { render } from 'react-dom';
import { rawStyles } from 'simplestyle-js';

import { App } from './components/App';
import { fontSizes, toPx } from './theme';

rawStyles({
  html: {
    fontFamily: 'monospace',
    fontSize: toPx(fontSizes.fontSize1),
  },
  '*': {
    '&:focus': {
      outline: 0,
    },
    boxSizing: 'border-box',
  },
});

render(<App />, document.getElementById('root'));
