import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { map, mergeMap, switchMap } from 'rxjs/operators';

import { CurrentUserService } from 'src/app/services/current-user.service';
import { Router } from '@angular/router';
import { UserApiService } from 'src/app/services/user.service';
import { UserLoginApiService } from 'src/app/services/user-login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private _loginInvalid = false;

  public get loginInvalid(): boolean {
    return this._loginInvalid;
  }

  public form: FormGroup = this.fb.group({
    email: new FormControl('', [
      Validators.required,
      Validators.email]),
    pw: new FormControl('', Validators.required)
  });

  constructor(protected fb: FormBuilder, private router: Router,
              private userLoginService: UserLoginApiService,
              private userService: UserApiService,
              private currentUserService: CurrentUserService) { }

  ngOnInit(): void {
  }

  public get email(){
    return this.form.get('email');
  }

  public get pw(){
    return this.form.get('pw');
  }

  public checkFields(email, pw) {
    let disabled = true;
    if (email.value && pw.value && this.form.get('email').valid){
      disabled = false;
    }
    return disabled;
  }

  public login(email, pw): void{

    const mail = email.value;
    this.userLoginService.loginUser(email.value, pw.value).pipe(
      map((response) => {
        if (response.result === 'OK'){
          // continue
        } else {
          this._loginInvalid = true;
          throw Error('invalid login');
        }
        return mail;
      }),
      switchMap((email_address) => {
        return this.userService.findUser(`filter={"email":"${email_address}"}`);
      })
    )
    .subscribe((user) => {
        this.currentUserService.setCurrentUser(user);
        localStorage.setItem('isLoggedIn', 'true');
        this._loginInvalid = false;
    });
  }

  public gotoRegistration(): void  {
    localStorage.setItem('isRegistering', 'true');
  }

}
