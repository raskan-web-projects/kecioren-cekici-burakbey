import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { App } from './site-app';
import { getRoute } from './routes';
import { initializeAnalytics } from './analytics';
import './base.css';
import './home.css';

const root = document.getElementById('root')!;
const route = getRoute(window.location.pathname);

if (route) {
  initializeAnalytics();
  const app = <App route={route} />;
  if (root.firstElementChild) {
    hydrateRoot(root, app);
  } else {
    document.title = route.title;
    createRoot(root).render(app);
  }
} else {
  document.title = 'Sayfa bulunamadı';
  createRoot(root).render(<main><h1>Bu sayfa bulunamadı.</h1><a href="/">Ana sayfaya dön</a></main>);
}
