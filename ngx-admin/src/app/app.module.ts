import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { NgxEchartsModule } from 'ngx-echarts';

import { CoreModule } from './@core/core.module';
import { ThemeModule } from './@theme/theme.module';
import { PagesModule } from './pages/pages.module';
import { authInterceptorProviders } from './services/auth.interceptor';

import {
  NbChatModule,
  NbCheckboxModule,
  NbDatepickerModule,
  NbDialogModule,
  NbMenuModule,
  NbSidebarModule,
  NbThemeModule,
  NbToastrModule,
  NbWindowModule,
} from '@nebular/theme';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,

    NbSidebarModule.forRoot(),
    NbThemeModule.forRoot(),
    NbMenuModule.forRoot(),
    NbCheckboxModule,
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    NbChatModule.forRoot({
      messageGoogleMapKey: 'AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY',
    }),

    NgxEchartsModule,

    CoreModule.forRoot(),
    ThemeModule.forRoot(),
    PagesModule, // N'oublie pas de l'inclure si tu veux charger les composants déclarés dans pages
  ],
  providers: [authInterceptorProviders],
  bootstrap: [AppComponent],
})
export class AppModule {}
