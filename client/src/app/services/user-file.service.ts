import { AppSettingsService } from '../services/app-settings.service';
import { BaseHttpService } from './base-http.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model.interface';

@Injectable({
  providedIn: 'root'
})
export class UserFileApiService extends BaseHttpService<User> {

  private _user_file_uri: string;

  public constructor(_http: HttpClient, appSettingsService: AppSettingsService) {

    super(_http);
    this._user_file_uri = appSettingsService.getValue('user_file_api').uri;
  }

  public getUsers(pageNumber, pageSize, filter = {}): Observable<User[]> {
    const requestUrl = `${this._user_file_uri}`;
    return this.getList(requestUrl);
  }

  public getUser(id: string): Observable<User> {
    return this.getItem(`${this._user_file_uri}/${id}`);
  }

  public postUser(item: User): Observable<User> {
    return this.postItem(`${this._user_file_uri}`, item);
  }

  public patchUser(id: string, item: Partial<User>): Observable<User> {
    return this.patchItem(`${this._user_file_uri}/${id}`, item);
  }

  public deleteUser(id: string, item: Partial<User>): Observable<User> {
    return this.deleteItem(`${this._user_file_uri}`, item);
  }
}
