import { CurrentContextService } from 'src/app/services/current-context.service';

export class SharedComponent {

  private _id: string;
  private _name: string;
  private _email: string;
  private _path = '/';

  public get id(): string {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }

  public get email(): string {
    return this._email;
  }

  public get path(): string {
    return this._path;
  }

  constructor(protected currentContextService: CurrentContextService){

  }

  protected setupSubscriptions(): void{
    this.currentContextService.currentContext.subscribe(
      (context) => {
        this._id = context.id;
        this._name = context.name;
        this._path = context.path;
        this._email = context.email;
       }
     );
  }

}
