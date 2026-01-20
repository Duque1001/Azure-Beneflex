import { Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { LoginComponent } from './pages/login';
import { MenuComponent } from './pages/menu';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'menu', component: MenuComponent, canActivate: [MsalGuard] },
  { path: '**', redirectTo: '' }
];
