import { AppSettings } from '../models/app-settings.model.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppSettingsService {

  public constructor(_http: HttpClient) {}

  public getValue(value: string): any {
    const data = environment[value];
    return data;
  }

  public getValues(): AppSettings {
    const data = environment;
    return data;
  }
}
