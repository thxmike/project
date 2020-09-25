import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HomeComponent } from '../components/home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { LayoutModule } from '@angular/cdk/layout';
import { MaterialModule } from '../modules/material/material.module';
import { NavigationComponent } from './navigation.component';
import { NavigationRoutingModule } from './navigation-routing.module';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FilesComponent } from '../components/files/files.component';
import { UploadDialogComponent } from '../components/upload-dialog/upload-dialog.component';
import { FloatButtonDialogComponent } from '../components/float-button-dialog/float-button-dialog.component';

@NgModule({
  declarations: [
    HomeComponent,
    NavigationComponent,
    FilesComponent,
    UploadDialogComponent,
    FloatButtonDialogComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    NavigationRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    LayoutModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  exports: [
    NavigationComponent
  ],
  providers: []
})
export class NavigationModule { }
