import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './layouts/login/login.component';
import { ForgotPasswordComponent } from './layouts/forgot-password/forgot-password.component';
import { BrokerageComponent } from './pages/components/brokerage/brokerage.component';
import { FollowingComponent } from './pages/components/following/following.component';
import { HomeComponent } from './pages/components/home/home.component';
import { MarketplaceMainComponent } from './pages/components/marketplace/marketplace.component';
import { AccountsComponent } from './pages/components/my-basket-info/accounts/accounts.component';
import { BasketComponent } from './pages/components/my-basket-info/basket/basket.component';
import { DashboardComponent } from './pages/components/my-basket-info/dashboard/dashboard.component';
import { JourneyInfoComponent } from './pages/components/my-basket-info/journey-info/journey-info.component';
import { MarketplaceComponent } from './pages/components/my-basket-info/marketplace/marketplace.component';
import { SettingsComponent } from './pages/components/my-basket-info/settings/settings.component';
import { SubscriptionComponent } from './pages/components/my-basket-info/subscription/subscription.component';
import { TradeComponent } from './pages/components/my-basket-info/trade/trade.component';
import { MyBasketsComponent } from './pages/components/my-baskets/my-baskets.component';
import { OwnerProfileComponent } from './pages/components/owner-profile/owner-profile.component';

import { AuthenticationGuard } from './authentication.guard';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthenticationGuard]
  },
  {
    path: 'baskets',
    component: MyBasketsComponent,
    canActivate: [AuthenticationGuard]
  },
  {
    path: 'my-basket-info/:id',
    component: JourneyInfoComponent,
    canActivate: [AuthenticationGuard],
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
      {
        path: 'basket',
        component: BasketComponent,
      },
      {
        path: 'account',
        component: AccountsComponent,
      },
      {
        path: 'trade',
        component: TradeComponent,
      },
      {
        path: 'settings',
        component: SettingsComponent,
      },
      {
        path: 'marketplace',
        component: MarketplaceComponent,
      },
      {
        path: 'subscription',
        component: SubscriptionComponent,
      }
    ]
  },
  {
    path: 'owner-profile/:id',
    component: OwnerProfileComponent,
    canActivate: [AuthenticationGuard]
  },
  {
    path: 'marketplace',
    component: MarketplaceMainComponent,
    canActivate: [AuthenticationGuard]
  },
  {
    path: 'brokerage',
    component: BrokerageComponent,
    canActivate: [AuthenticationGuard]
  },
  {
    path: 'following',
    component: FollowingComponent,
    canActivate: [AuthenticationGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
