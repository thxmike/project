import { RouterModule, Routes } from '@angular/router';

import { FilesComponent } from '../components/files/files.component';
import { HomeComponent } from '../components/home/home.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  { path: 'files', component: FilesComponent },
  { path: '**', redirectTo: '/files' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NavigationRoutingModule { }
