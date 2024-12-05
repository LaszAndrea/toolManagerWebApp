import { Configuration, LogLevel } from '@azure/msal-browser';

export const msalConfig: Configuration = {
  auth: {
    clientId: 'ece8ec56-4e4c-4350-862e-5e70b724519b',
    authority: 'https://login.microsoftonline.com/29063ecc-ec46-4544-8942-fefb1c51a322',
    redirectUri: 'http://localhost:4200',
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: true,
  },
  system: {
    loggerOptions: {
      logLevel: LogLevel.Info,
    },
  },
};

export const loginRequest = {
    scopes: ['https://graph.microsoft.com/Sites.ReadWrite.All'],
  };
