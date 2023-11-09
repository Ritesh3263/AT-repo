import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BasketComponent } from './pages/components/my-basket-info/basket/basket.component';
import { DashboardComponent } from './pages/components/my-basket-info/dashboard/dashboard.component';
import { JourneyInfoComponent } from './pages/components/my-basket-info/journey-info/journey-info.component';
import { MyBasketsComponent } from './pages/components/my-baskets/my-baskets.component';

const routes: Routes = [
  {
    path: 'my-basket',
    component: MyBasketsComponent,
  },
  {
    path: 'my-basket-info',
    component: JourneyInfoComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
      {
        path: 'basket',
        component: BasketComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

