import { InteractionType, PublicClientApplication } from '@azure/msal-browser';
import {
  MsalGuardConfiguration,
  MsalInterceptorConfiguration
} from '@azure/msal-angular';
import { environment } from '../environments/environment';

export function msalInstanceFactory() {
  return new PublicClientApplication({
    auth: {
      clientId: environment.spaClientId,
      authority: `https://login.microsoftonline.com/${environment.tenantId}`,
      //redirectUri: 'http://localhost:4200'
      redirectUri: environment.redirectUri,
      postLogoutRedirectUri: environment.redirectUri,
    },
    cache: {
      cacheLocation: 'localStorage',
    }
  });
}

export function msalGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: [environment.apiScope]
    }
  };
}

export function msalInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();

  // IMPORTANTE: que coincida con tu baseUrl del API
  protectedResourceMap.set(environment.apiBaseUrl, [environment.apiScope]);

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap
  };
}
