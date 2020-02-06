import React from 'react';
import {render} from 'react-dom';
import './style.css';

import {MsgProvider} from './MessageContext';
import Page from './Page';

const App = () => {
  return (
    <MsgProvider>
      <Page />
    </MsgProvider>
  );
};

render(<App />, document.getElementById('root'));
