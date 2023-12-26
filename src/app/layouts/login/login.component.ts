import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {FormControl, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  hidePassword = true;

  error: any = {};
  info: any = {};
  passwordResetToken: string = "";

  linkedin: string = 'linkedin';
  google: string = 'google';
  facebook: string = 'facebook';

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private userService: UserService, private _snackBar: MatSnackBar) {
    const params = this.activatedRoute.snapshot.queryParams;
    // Handle oAuth Redirect Callback URL Code
    if(params && params['code']) {
      this.userService.getUserDetails().then((user:any) => {
        if(user && user.displayName){
          this.router.navigate(['/brokerage'],{ state: {code:params['code'],user:user} });
        }else{
      this.userService.getLoginToken(params['code']).then((data: any) =>{
        // If we have contact record returned, authentication has succeeded
        if(data && data.user) {
          if(data.user.roles && data.user.roles.includes('admin'))
            this.router.navigate(['/admin/users']); // Navigate to Baskets Page (TODO - Dashboard Page)
          else
            this.router.navigate(['/home']); // Navigate to Baskets Page (TODO - Dashboard Page)
        }
        else {
          this.error.message = JSON.stringify(data,null,2);
          this.displayInfoMessage(this.error.message, true);
        }
      })
    }
    })
  
    }
  }

  // Get Federated Authentication Redirect URI and Navigate the Client to the Federated Login Screen
  loginWithFederation(provider: string) {
    this.userService.getLoginUri(provider).then((data: any) =>{
      if(data && data.uri) {
        window.location = data.uri;
        return;
      }
      else {
        this.error.message = JSON.stringify(data,null,2);
        this.displayInfoMessage(this.error.message, true);
      }
    })
  }

  login() {
    // Standard Username / Password Authentication
    this.error.message = null;
    this.userService.login(this.email.getRawValue(), this.password.getRawValue()).then((authenticated: any) => {
      if(authenticated && authenticated.success) {
        if(authenticated && authenticated.user && authenticated.user.roles && authenticated.user.roles.includes('admin'))
          this.router.navigate(['/admin/users']); // Navigate to Baskets Page (TODO - Dashboard Page)
        else
          this.router.navigate(['/home']); // Navigate to Baskets Page (TODO - Dashboard Page)
      }
      else {
        this.error.message = authenticated.message || "Invalid login details, please try again." ;
        this.displayInfoMessage(this.error.message, true);
      }
    })
  }

  resetPassword() {
    this.router.navigate(['/forgot-password'])
  }

  signup() {
    this.router.navigate(['/sign-up']);
  }

  getErrorMessage(value: FormControl, email=false) {
    if (value.hasError('required')) {
      return 'You must enter a value';
    }
    if(email)
      return value.hasError('email') ? 'Not a valid email' : '';

    return ''
  }

  displayInfoMessage(message: string, error = false) {
    this._snackBar.open(message, 'Dismiss', {
      duration: 3000,
      panelClass: error ? ['warn-snackbar'] : ['primary-snackbar']
    });
  }

  isFormValid() {
    return this.getErrorMessage(this.email, true) == '' &&
          this.getErrorMessage(this.password) == '';
  }

}