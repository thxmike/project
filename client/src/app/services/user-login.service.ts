import { AppSettingsService } from './app-settings.service';
import { BaseHttpService } from './base-http.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model.interface';

@Injectable({
  providedIn: 'root'
})
export class UserLoginApiService extends BaseHttpService<User> {

  private user_login_uri: string;

  public constructor(_http: HttpClient, private appSettingsService: AppSettingsService,
                     ) {

    super(_http);
    this.user_login_uri = appSettingsService.getValue('user_file_api').uri;
  }

  public loginUser(email: string, pw: string): Observable<any> {
    const payload = { email, pw };
    return this.postItem(`${this.user_login_uri}/login`, payload);
  }
}
