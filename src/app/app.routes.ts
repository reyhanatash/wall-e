import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/components/dashbaord/dashbaord.component')
        .then(m => m.DashbaordComponent)
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];