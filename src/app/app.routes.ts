import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    data: { pageTitle: 'Sign in' },
    loadComponent: () => import('./login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'home',
    canActivate: [authGuard],
    data: { eyebrow: 'Inpui', pageTitle: 'Dashboard' },
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'news',
    canActivate: [authGuard],
    data: { eyebrow: 'Chanchinthar', pageTitle: 'News' },
    loadComponent: () => import('./news/news.page').then((m) => m.NewsPage),
  },
  {
    path: 'events',
    canActivate: [authGuard],
    data: { eyebrow: 'Thil thleng', pageTitle: 'Events' },
    loadComponent: () => import('./events/events.page').then((m) => m.EventsPage),
  },
  {
    path: 'members',
    canActivate: [authGuard],
    data: { eyebrow: 'Mi te', pageTitle: 'Members' },
    loadComponent: () => import('./members/members.page').then((m) => m.MembersPage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
