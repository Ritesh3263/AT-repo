import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HeaderComponent } from './layouts/header/header.component';
import { MenuComponent } from './layouts/menu/menu.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MyBasketsComponent } from './pages/components/my-baskets/my-baskets.component';
import { HomeComponent } from './pages/components/home/home.component';
import { CreateBasketComponent } from './pages/components/create-basket/create-basket.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatTableModule} from '@angular/material/table';
import { JourneyInfoComponent } from './pages/components/my-basket-info/journey-info/journey-info.component';
import { DashboardComponent } from './pages/components/my-basket-info/dashboard/dashboard.component';
import { BasketComponent } from './pages/components/my-basket-info/basket/basket.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import { CloneBasketComponent } from './pages/components/my-basket-info/clone-basket/clone-basket.component';
import { DeleteBasketComponent } from './pages/components/my-basket-info/delete-basket/delete-basket.component';
import { AddSymbolsComponent } from './pages/components/my-basket-info/add-symbols/add-symbols.component';
import { DeleteSymbolsComponent } from './pages/components/my-basket-info/delete-symbols/delete-symbols.component';
import { AccountsComponent } from './pages/components/my-basket-info/accounts/accounts.component';
import { TradeComponent } from './pages/components/my-basket-info/trade/trade.component';
import { SettingsComponent } from './pages/components/my-basket-info/settings/settings.component';
import { SubscriptionComponent } from './pages/components/my-basket-info/subscription/subscription.component';
import {MatDividerModule} from '@angular/material/divider';
import { WidgetDialogComponent } from './pages/components/my-basket-info/widget-dialog/widget-dialog.component';
import { ConfirmTradeComponent } from './pages/components/my-basket-info/confirm-trade/confirm-trade.component';
import { CalculateDialogComponent } from './pages/components/my-basket-info/calculate-dialog/calculate-dialog.component';
import { LoginComponent } from './layouts/login/login.component';
import { ProfileComponent } from './pages/components/profile/profile.component';
import {MatRadioModule} from '@angular/material/radio';
import {MatTabsModule} from '@angular/material/tabs';
import { MarketplaceComponent } from './pages/components/my-basket-info/marketplace/marketplace.component';
import { TermsConditionsComponent } from './pages/components/my-basket-info/terms-conditions/terms-conditions.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { TurnoffMarketplaceComponent } from './pages/components/my-basket-info/turnoff-marketplace/turnoff-marketplace.component';
import { OwnerProfileComponent } from './pages/components/owner-profile/owner-profile.component';
import { MarketplaceMainComponent } from './pages/components/marketplace/marketplace.component';
import { BrokerageComponent } from './pages/components/brokerage/brokerage.component';
import { ConnectDialogComponent } from './pages/components/brokerage/connect-dialog/connect-dialog.component';
import { FollowingComponent } from './pages/components/following/following.component';
import { FeedbackComponent } from './pages/components/feedback/feedback.component';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ForgotPasswordComponent } from './layouts/forgot-password/forgot-password.component';
import { SpinnerComponent } from './pages/components/spinner/spinner.component';
import { WebsocketComponent } from './pages/components/websocket/websocket.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
const config: SocketIoConfig = { url: 'http://localhost:2000', options: {} };


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MenuComponent,
    MyBasketsComponent,
    HomeComponent,
    CreateBasketComponent,
    JourneyInfoComponent,
    DashboardComponent,
    BasketComponent,
    AddSymbolsComponent,
    DeleteSymbolsComponent,
    CloneBasketComponent,
    DeleteBasketComponent,
    AccountsComponent,
    TradeComponent,
    SettingsComponent,
    SubscriptionComponent,
    WidgetDialogComponent,
    ConfirmTradeComponent,
    CalculateDialogComponent,
    LoginComponent,
    ProfileComponent,
    MarketplaceComponent,
    TermsConditionsComponent,
    TurnoffMarketplaceComponent,
    OwnerProfileComponent,
    MarketplaceMainComponent,
    BrokerageComponent,
    ConnectDialogComponent,
    FollowingComponent,
    FeedbackComponent,
    ForgotPasswordComponent,
    SpinnerComponent,
    WebsocketComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatIconModule,
    MatFormFieldModule,
    FlexLayoutModule,
    MatInputModule,
    MatMenuModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatCardModule,
    MatDialogModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatDividerModule,
    MatRadioModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
