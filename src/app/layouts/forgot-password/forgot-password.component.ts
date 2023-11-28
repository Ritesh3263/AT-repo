import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {FormControl, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  mode: string = 'forgotPassword';

  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  hidePassword = true;

  error: any = {};
  info: any = {};
  passwordResetToken: string = "";


  constructor(private router: Router, private activatedRoute: ActivatedRoute, private userService: UserService, private _snackBar: MatSnackBar) {
    const params = this.activatedRoute.snapshot.queryParams;
    // Handle oAuth Redirect Callback URL Code
    if(params && params['code']) {
      this.userService.getLoginToken(params['code']).then((data: any) =>{
        // If we have contact record returned, authentication has succeeded
        if(data && data.user) {
          this.router.navigate(['/home']); // Navigate to Baskets Page (TODO - Dashboard Page)
        }
        else {
          this.error.message = JSON.stringify(data,null,2);
          this.displayInfoMessage(this.error.message, true);
        }
      })
    }
    else if(params && params['token']) {
      this.userService.verifyPasswordResetToken(params['token']).then((token: any) =>{
        // If we have contact record returned, authentication has succeeded
        if(token && token.success) {
          this.info.message = `Welcome back ${token.firstName}!  Please set your new password.`
          this.displayInfoMessage(this.info.message);
          this.mode = 'resetPassword';
          this.passwordResetToken = params['token'];
        }
        else {
          // TODO: Better Login Error Messaging
          this.error.message = "This link has expired.  Please request another password reset."
          this.displayInfoMessage(this.error.message, true);
        }
      })
    }
  }

  login() {
    this.router.navigate(['/login']);
  }

  sendPasswordResetEmail() {
    // Send forgot password link to input email address
    this.error.message = null;
    this.userService.sendPasswordResetEmail(this.email.getRawValue()).then((result: any) => {
      if(result && result.data && result.data.MessageId) {
        this.info.message = "Email sent.  Please check your inbox and follow the link to reset your password."
        this.displayInfoMessage(this.info.message);
      }
      else {
        this.error.message = JSON.stringify(result.error); // TODO: Refine this
        this.displayInfoMessage(this.error.message, true);
      }
    });
  }

  resetPassword() {
    // Reset the users passsword
    this.error.message = null;
    this.userService.resetPassword(this.passwordResetToken, this.password.getRawValue()).then((result: any) => {
      if(result && result.success && !result.error) {
        this.info.message = 'Password Reset.  Please login using your new password to continue accessing the portal.'
        this.displayInfoMessage(this.info.message);
        this.router.navigate(['/login']);
      }
      else {
        this.error.message = JSON.stringify(result.error); // TODO: Refine this
        this.displayInfoMessage(this.error.message, true);
      }
    });
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
      duration: 10000,
      panelClass: error ? ['warn-snackbar'] : ['primary-snackbar']
    });
  }

  isEmailValid() {
    return this.getErrorMessage(this.email, true) == ''
  }

  isPasswordValid() {
    return this.getErrorMessage(this.password) == '';
  }
}
