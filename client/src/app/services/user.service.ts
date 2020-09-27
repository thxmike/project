import { AppSettingsService } from './app-settings.service';
import { BaseHttpService } from './base-http.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model.interface';

@Injectable({
  providedIn: 'root'
})
export class UserApiService extends BaseHttpService<User> {

  private _userFileUri: string;

  public constructor(_http: HttpClient, appSettingsService: AppSettingsService) {

    super(_http);
    this._userFileUri = `${appSettingsService.getValue('user_file_api').uri}/users`;
  }

  public getUsers(pageNumber, pageSize, filter = {}): Observable<User[]> {
    const requestUrl = `${this._userFileUri}`;
    return this.getList(requestUrl);
  }

  public getUser(id: string): Observable<User> {
    return this.getItem(`${this._userFileUri}/${id}`);
  }

  public findUser(filter: string): Observable<User> {
    return this.findItem(`${this._userFileUri}`, filter);
  }

  public createUser(item: User): Observable<User> {
    return this.postItem(`${this._userFileUri}`, item);
  }

  public updateUser(id: string, item: Partial<User>): Observable<User> {
    return this.patchItem(`${this._userFileUri}/${id}`, item);
  }

  public deleteUser(id: string, item: Partial<User>): Observable<void> {
    return this.deleteItem(`${this._userFileUri}`);
  }
}
