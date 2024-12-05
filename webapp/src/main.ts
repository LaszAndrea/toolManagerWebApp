import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { HttpClientModule } from '@angular/common/http';
import { PublicClientApplication } from '@azure/msal-browser';
import { MSAL_INSTANCE, MSAL_GUARD_CONFIG, MsalService } from '@azure/msal-angular';
import { msalConfig } from './msal-config';
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { FrontendService } from './app/frontend_service/frontend.service';
import { HomeComponent } from './app/home/home.component';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';

export function MSALInstanceFactory() {
  return new PublicClientApplication(msalConfig);
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    MsalService,
    importProvidersFrom(HttpClientModule),
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory,
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useValue: {},
    },
    FrontendService,
    HomeComponent,
    provideToastr(),
    provideAnimations()
  ],
}).catch((err) => console.error(err));
