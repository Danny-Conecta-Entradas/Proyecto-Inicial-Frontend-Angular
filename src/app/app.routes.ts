import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component.js'
import { RegisterPageComponent } from './pages/register-page/register-page.component.js'
import { HomeComponent } from './pages/home/home.component.js'
import { authGuard, publicGuard } from './guards/auth.guards.js'

// https://angular.io/api/router/Route

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'register',
  },
  {
    path: 'login',
    component: LoginPageComponent,
    canActivate: [publicGuard],
  },
  {
    path: 'register',
    component: RegisterPageComponent,
    canActivate: [publicGuard],
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard],
  },
]
