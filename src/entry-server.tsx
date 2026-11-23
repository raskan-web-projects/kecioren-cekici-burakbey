import React from 'react';
import { renderToString } from 'react-dom/server';
import { App } from './site-app';
import type { Route } from './routes';

export { site } from './site';
export { getRoute, routes } from './routes';

export function render(route: Route) {
  return renderToString(<App route={route} />);
}
