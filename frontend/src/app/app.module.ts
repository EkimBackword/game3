import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  TUI_SANITIZER,
  TuiAlertModule,
  TuiDialogModule,
  TuiRootModule,
} from '@taiga-ui/core';
import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { MenuComponent } from './menu/menu.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

@NgModule({
  declarations: [	
    AppComponent,
      AuthComponent,
      MenuComponent,
      PageNotFoundComponent
   ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    TuiRootModule,
    TuiDialogModule,
    TuiAlertModule
  ],
  providers: [{provide: TUI_SANITIZER, useClass: NgDompurifySanitizer}],
  bootstrap: [AppComponent]
})
export class AppModule { }
