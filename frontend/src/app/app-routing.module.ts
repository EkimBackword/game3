import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
} from '@angular/router';

import { AuthComponent } from './auth/auth.component';
import { MenuComponent } from './menu/menu.component';
import {
  PageNotFoundComponent,
} from './page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: '',  
    redirectTo: '/menu',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    component: AuthComponent,
  },
  {
    path: 'menu',
    component: MenuComponent,
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
