import { InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { MsalGuardConfiguration, MsalInterceptorConfiguration } from '@azure/msal-angular';
import { environment } from '../environments/environment';

const redirectUri = window.location.origin + '/';

export function msalInstanceFactory() {
  return new PublicClientApplication({
    auth: {
      clientId: environment.spaClientId,
      authority: `https://login.microsoftonline.com/${environment.tenantId}`,
      redirectUri,
      postLogoutRedirectUri: redirectUri
    },
    cache: {
      cacheLocation: 'localStorage'
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
  protectedResourceMap.set(environment.apiBaseUrl, [environment.apiScope]);

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap
  };
}
