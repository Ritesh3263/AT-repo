import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyBasketsComponent } from './pages/components/my-baskets/my-baskets.component';

const routes: Routes = [
  {
    path: 'my-basket',
    component: MyBasketsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

