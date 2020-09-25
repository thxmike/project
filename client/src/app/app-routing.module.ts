import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { NgModule } from '@angular/core';
import { RegisterComponent } from './components/register/register.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes
    // , { enableTracing: true }
    )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
