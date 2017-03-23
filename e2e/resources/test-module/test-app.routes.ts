import { Routes, Route } from '@angular/router';
import { TestAppComponent } from './test-app.component';

export const routes: Routes = [
  { path: 'login', component: TestAppComponent },
  //{ path: 'help', component: c.HelpComponent },
  { path: '**', redirectTo: 'login' }
];

(<Route>{}).data