import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, LOCALE_ID, NgModule} from '@angular/core';
import {AngularFireModule} from '@angular/fire';

import {AppComponent} from './app.component';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {DashboardModule} from './dashboard/dashboard.module';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard/dashboard.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {GroceryListComponent} from './menus/menus/grocery-list/grocery-list.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ShoppingListComponent} from './dashboard/shopping-list/shopping-list.component';
import {LoginComponent} from './login/login.component';
import {LoginModule} from './login/login.module';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireAuthGuard, redirectLoggedInTo, redirectUnauthorizedTo} from '@angular/fire/auth-guard';
import {MenusComponent} from './menus/menus/menus.component';
import {CoreModule} from './core/core.module';
import {MealComponent} from './meals/meal/meal.component';
import {MealsModule} from './meals/meals.module';
import {MealListComponent} from './meals/meal-list/meal-list.component';
import {MenuComponent} from './menus/menu/menu.component';
import {MenusModule} from './menus/menus.module';
import {registerLocaleData} from '@angular/common';
import localeNl from '@angular/common/locales/nl-AW';
import {GlobalErrorHandler} from './core/services/error/error.handler';
import {PlanComponent} from './plan/plan/plan.component';
import {PlanModule} from './plan/plan.module';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToItems = () => redirectLoggedInTo(['dashboard']);

registerLocaleData(localeNl);

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AngularFireAuthGuard],
    data: {authGuardPipe: redirectUnauthorizedToLogin}
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AngularFireAuthGuard],
    data: {authGuardPipe: redirectLoggedInToItems}
  },
  {
    path: 'grocery',
    canActivate: [AngularFireAuthGuard],
    data: {authGuardPipe: redirectUnauthorizedToLogin},
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list/:id',
        component: GroceryListComponent
      }
    ]
  },
  {
    path: 'shopping-list',
    component: ShoppingListComponent,
    canActivate: [AngularFireAuthGuard],
    data: {authGuardPipe: redirectUnauthorizedToLogin}
  },
  {
    path: 'menus',
    canActivate: [AngularFireAuthGuard],
    data: {authGuardPipe: redirectUnauthorizedToLogin},
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: MenusComponent
      },
      {
        path: 'create',
        component: MenuComponent
      },
      {
        path: ':id',
        component: MenuComponent
      }
    ]
  },
  {
    path: 'meals',
    canActivate: [AngularFireAuthGuard],
    data: {authGuardPipe: redirectUnauthorizedToLogin},
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: MealListComponent
      },
      {
        path: 'create',
        component: MealComponent
      },
      {
        path: ':id',
        component: MealComponent
      }
    ]
  },
  {
    path: 'plan',
    component: PlanComponent,
    canActivate: [AngularFireAuthGuard],
    data: {authGuardPipe: redirectUnauthorizedToLogin}
  }
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
    DashboardModule,
    RouterModule.forRoot(appRoutes),
    FontAwesomeModule,
    AngularFireModule.initializeApp(environment.firebase),
    BrowserAnimationsModule,
    LoginModule,
    AngularFireAuthModule,
    CoreModule,
    MealsModule,
    MenusModule,
    PlanModule
  ],
  providers: [
    {provide: LOCALE_ID, useValue: 'nl-AW'},
    {provide: ErrorHandler, useClass: GlobalErrorHandler},
    AngularFireAuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
