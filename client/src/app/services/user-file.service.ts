import { AppSettingsService } from './app-settings.service';
import { BaseHttpService } from './base-http.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserFile } from '../models/file.model.interface';

@Injectable({
  providedIn: 'root'
})
export class UserFileApiService extends BaseHttpService<UserFile> {

  private _userFileUri: string;

  public constructor(_http: HttpClient, appSettingsService: AppSettingsService) {

    super(_http);
    this._userFileUri = appSettingsService.getValue('user_file_api').uri;
  }

  public getUserFiles(id: string, filter = {}): Observable<UserFile[]> {
    const uri = `${this._userFileUri}/users/${id}/files?filter=${JSON.stringify(filter)}`;
    return this.getList(uri);
  }

  public findFile(filter: string): Observable<UserFile> {
    return this.findItem(`${this._userFileUri}/files`, filter);
  }

  public deleteFileOrFolder(userId: string, fileOrFolder: Partial<UserFile>): Observable<any> {
    if (fileOrFolder.name){
      return this.deleteItem(`${this._userFileUri}/users/${userId}/files/${fileOrFolder.original_file_id}?filter={"file_id":"${fileOrFolder._id}"}`);
    } else {
      return this.deleteItem(`${this._userFileUri}/users/${userId}/files/0?filter={"path":"${fileOrFolder.path}"}`);
    }
  }


  public updateFile(userId: string, fileId: string, partialUpdate: Partial<UserFile>): Observable<UserFile> {
    return this.patchItem(`${this._userFileUri}/users/${userId}/files/${fileId}`, partialUpdate);
  }

  public downloadFile(userId: string, fileId: string): Observable<any> {
    return super.downloadItem(`${this._userFileUri}/users/${userId}/files/${fileId}`, null);
  }

  public uploadFile(userId: string, path: string, data: any){
     return this.uploadItem(`${this._userFileUri}/users/${userId}/files?path=${path}`, data);
  }
}
