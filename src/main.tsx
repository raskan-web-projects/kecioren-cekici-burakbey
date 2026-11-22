import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { App } from './site-view';
import { initializeAnalytics } from './analytics';
import './styles.css';
import './sections.css';
import './theme.css';

initializeAnalytics();
hydrateRoot(document.getElementById('root')!, <App />);
