import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/module/shared.module';
import { OrderComponent } from './order.component';
import { InfoOrderComponent } from './info-order/info-order.component';

const routes: Routes = [
  {
    path: '',
    component: OrderComponent
  },
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OrderComponent, InfoOrderComponent]
})
export class OrderModule { }
