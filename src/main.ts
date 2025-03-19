import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { MainComponent } from './app/main.component';
import { routes } from './app/app.routes';

bootstrapApplication(MainComponent, {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(),
  ]
}).catch(err => console.error(err));
