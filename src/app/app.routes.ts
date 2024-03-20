import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component.js'
import { RegisterPageComponent } from './pages/register-page/register-page.component.js'
import { HomeComponent } from './pages/home/home.component.js'

// https://angular.io/api/router/Route

export const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'login'},
  {path: 'login', component: LoginPageComponent},
  {path: 'register', component: RegisterPageComponent},
  {path: 'home', component: HomeComponent},
];
