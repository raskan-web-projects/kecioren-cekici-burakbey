import React from 'react';
import { renderToString } from 'react-dom/server';
import { App } from './site-view';
export { site } from './site';
export { tr as content } from './content/tr';
export { pageTitle, description } from './content/tr';

export function render() {
  return renderToString(<App />);
}
