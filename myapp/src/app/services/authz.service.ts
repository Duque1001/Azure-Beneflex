import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { environment } from '../../environments/environment';
import { InteractionRequiredAuthError } from '@azure/msal-browser';

function decodeJwt(token: string): any {
  const payload = token.split('.')[1];
  const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(atob(normalized));
}

@Injectable({ providedIn: 'root' })
export class AuthzService {
  constructor(private msal: MsalService) {}

  async hasRole(role: string): Promise<boolean> {
    await this.msal.instance.initialize();

    // ✅ asegurar cuenta activa
    let account = this.msal.instance.getActiveAccount();
    if (!account) {
      const accounts = this.msal.instance.getAllAccounts();
      if (accounts.length === 0) return false;
      this.msal.instance.setActiveAccount(accounts[0]);
      account = accounts[0];
    }

    try {
      const result = await this.msal.instance.acquireTokenSilent({
        account,
        scopes: [environment.apiScope]
      });

      const claims = decodeJwt(result.accessToken);

      const roles: string[] = claims.roles || [];
      return roles.includes(role);

    } catch (e: any) {
      // ✅ si silent requiere interacción, no te quedes pegado
      if (e instanceof InteractionRequiredAuthError) {
        // OJO: no queremos loop infinito. Para este caso, simplemente no mostramos Aprobaciones.
        // Si quieres forzar, puedes hacer acquireTokenRedirect aquí, pero te redirige otra vez.
        return false;
      }

      console.error('Error leyendo rol:', e);
      return false;
    }
  }
}
