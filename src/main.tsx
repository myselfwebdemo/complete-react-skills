import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';

import { App } from '@components/app/app';

import appStore from './store';

import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={appStore}>
      <HashRouter>
        <App />
      </HashRouter>
    </Provider>
  </StrictMode>
);
