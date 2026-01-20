import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html'
})
export class AppComponent implements OnInit {
  private msal = inject(MsalService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  async ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    // MSAL v3: obligatorio
    await this.msal.instance.initialize();

    // Si venimos de loginRedirect, aquí llega el resultado
    const result = await this.msal.instance.handleRedirectPromise();

    // Si hay resultado, se acaba de loguear
    if (result?.account) {
      this.msal.instance.setActiveAccount(result.account);
      // manda al menú
      await this.router.navigate(['/menu']);
      return;
    }

    // Si no hay resultado, pero ya había sesión guardada:
    const accounts = this.msal.instance.getAllAccounts();
    if (accounts.length > 0 && !this.msal.instance.getActiveAccount()) {
      this.msal.instance.setActiveAccount(accounts[0]);
    }
  }
}
