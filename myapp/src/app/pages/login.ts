import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { environment } from '../../environments/environment';

@Component({
  standalone: true,
  selector: 'app-login',
  template: `
    <h1>Inicio</h1>
    <button (click)="ingresar()">Ingresar</button>
  `
})
export class LoginComponent {
  private msal = inject(MsalService);
  private router = inject(Router);

  async ingresar() {
    // por si ya está logueado
    const acc = this.msal.instance.getActiveAccount() ?? this.msal.instance.getAllAccounts()[0];
    if (acc) {
      this.msal.instance.setActiveAccount(acc);
      await this.router.navigate(['/menu']);
      return;
    }

    this.msal.loginRedirect({
      scopes: [environment.apiScope]
    });
  }
}
