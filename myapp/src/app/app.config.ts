import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import {
  MsalModule,
  MsalService,
  MsalGuard,
  MsalBroadcastService,
  MsalInterceptor,
  MSAL_INSTANCE,
  MSAL_GUARD_CONFIG,
  MSAL_INTERCEPTOR_CONFIG
} from '@azure/msal-angular';

import { routes } from './app.routes';
import {
  msalInstanceFactory,
  msalGuardConfigFactory,
  msalInterceptorConfigFactory
} from './msal.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    // IMPORTANTE para que funcionen interceptors en standalone
    provideHttpClient(withInterceptorsFromDi()),

    importProvidersFrom(MsalModule),

    { provide: MSAL_INSTANCE, useFactory: msalInstanceFactory },
    { provide: MSAL_GUARD_CONFIG, useFactory: msalGuardConfigFactory },
    { provide: MSAL_INTERCEPTOR_CONFIG, useFactory: msalInterceptorConfigFactory },

    MsalService,
    MsalGuard,
    MsalBroadcastService,

    { provide: HTTP_INTERCEPTORS, useClass: MsalInterceptor, multi: true }
  ]
};


