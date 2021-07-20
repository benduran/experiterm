import React from 'react';
import { render } from 'react-dom';

let s = 'thing';
s = 123;

console.info(s);

render(<div>Stuff</div>, document.getElementById('root'));
