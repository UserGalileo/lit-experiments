import { Route } from './utils/router';
import { html } from 'lit';

export const routes: Route[] = [
  {
    path: '/',
    render: () => html`<app-home></app-home>`,
    setup: () => import('./views/home.component')
  },
  {
    path: '/users',
    render: () => html`<app-users></app-users>`,
    setup: () => import('./views/users.component'),
    children: [
      {
        path: '/:id',
        render: (params) => html`<app-user .userId="${params.id}"></app-user>`,
        setup: () => import('./views/user.component'),
      }
    ]
  },
  {
    path: '**',
    render: () => html`<app-home></app-home>`
  }
];
