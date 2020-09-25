import { AppSettingsService } from './app-settings.service';
import { BaseHttpService } from './base-http.service';
import { File } from '../models/file.model.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserFileApiService extends BaseHttpService<File> {

  private _user_file_uri: string;

  public constructor(_http: HttpClient, appSettingsService: AppSettingsService) {

    super(_http);
    this._user_file_uri = appSettingsService.getValue('user_file_api').uri;
  }

  public getUserFiles(id: string, filter = {}): Observable<File[]> {
    const uri = `${this._user_file_uri}/users/${id}/files?filter=${JSON.stringify(filter)}`;
    return this.getList(uri);
  }

  public getFile(id: string): Observable<File> {
    return this.getItem(`${this._user_file_uri}/${id}`);
  }

  public findFile(filter: string): Observable<File> {
    return this.findItem(`${this._user_file_uri}/files`, filter);
  }

  // Upload a file
  public postFile(item: FormData): Observable<any> {
    return this.upload(`${this._user_file_uri}`, item);
  }

  public patchFile(id: string, item: Partial<File>): Observable<File> {
    return this.patchItem(`${this._user_file_uri}/${id}`, item);
  }

  public deleteFile(id: string, item: Partial<File>): Observable<File> {
    return this.deleteItem(`${this._user_file_uri}/${id}`, item);
  }

  public downloadFile(user_id: string, file_id: string): Observable<any> {
    return super.downloadItem(`${this._user_file_uri}/users/${user_id}/files/${file_id}`, null);
  }
}
