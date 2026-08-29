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
      import('./features/components/dashboard/dashboard.component')
        .then(m => m.DashboardComponent)
  },
  {
    path: 'prompts',
    loadComponent: () =>
      import('./features/components/prompts/prompt-studio.component')
        .then(m => m.PromptStudioComponent)
  },
  {
    path: 'review',
    loadComponent: () =>
      import('./features/components/review/review.component')
        .then(m => m.ReviewWorkspaceComponent)
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];