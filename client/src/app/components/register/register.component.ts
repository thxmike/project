import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { CurrentContextService } from 'src/app/services/current-context.service';
import { UserApiService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {


  public form: FormGroup = this.fb.group({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [
      Validators.required,
      Validators.email]),
    pw: new FormControl('', [Validators.required])
  });

  public get name(){
    return this.form.get('name');
  }

  public get email(){
    return this.form.get('email');
  }

  public get pw(){
    return this.form.get('pw');
  }

  constructor(protected fb: FormBuilder, protected userService: UserApiService,
              protected currentContextService: CurrentContextService) { }

  ngOnInit(): void {
  }


  public checkFields(name, email, pw) {
    let disabled = true;
    if (name.value && email.value && pw.value && this.form.get('email').valid){
      disabled = false;
    }
    return disabled;
  }

  public gotoLogin(): void  {
    localStorage.setItem('isRegistering', 'false');
    localStorage.setItem('isLoggedIn', 'false');
  }

  public onRegister(name, email, pw): void{

    this.userService.createUser({ name: name.value, password: pw.value, email: email.value }).subscribe((response) => {

      const initpath = {path:  '/'};

      const currentUser = {
        id: response._id,
        name: response.name,
        password: response.password,
        email: response.email
      };

      const context = {...currentUser, ...initpath  };

      this.currentContextService.setCurrentContext(context);
      localStorage.setItem('isRegistering', 'false');
      localStorage.setItem('isLoggedIn', 'true');
    });
  }

}
