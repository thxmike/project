import { Component, OnInit } from '@angular/core';

import { CurrentContextService } from 'src/app/services/current-context.service';
import { UserFileApiService } from 'src/app/services/user-file.service';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit {

  private _id: string;
  private _name: string;
  private _email: string;
  private _path = '/';
  private _files = [
  ];

  public get files() {
    return this._files;
  }

  public get name() {
    return this._name;
  }

  public get email() {
    return this._email;
  }

  public get path() {
    return this._path;
  }

  constructor(private currentUserService: CurrentContextService, private userFileApiService: UserFileApiService) {
    this.setupSubscriptions();
  }

  ngOnInit(): void {
    this.getUserFiles();
  }

  private setupSubscriptions(){
    this.currentUserService.currentContext.subscribe(
      (context) => {
        this._id = context[0].id;
        this._name = context[0].name;
        this._path = context[0].path;
        this._email = context[0].email;
       }
     );
  }

  private getUserFiles() {
    this.userFileApiService.getFiles(1, 1000, {name: this._name, path: this._path}).subscribe((fl) => {
      fl.forEach((file) => {
        this.files.push(file);
      });
    });
  }

}
