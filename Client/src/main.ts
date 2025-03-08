import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig) // Bootstrap the application and pass the root component and the app configuration
  .catch((err) => console.error(err));
