import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlannerComponent } from './planner/planner.component';

const routes: Routes = [{ path: '', component: PlannerComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
