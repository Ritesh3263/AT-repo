import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {FormControl, Validators, FormGroup} from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  mode: string = 'forgotPassword';

  passwordResetToken: string = "";

  emailForm: FormGroup = new FormGroup('')
  passwordForm: FormGroup = new FormGroup('')

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private userService: UserService, public utilityService: UtilitiesService) {  }

  async ngOnInit() {
    this.emailForm = this.utilityService.initalizeForm([{ key: 'email',  required: true, type: 'email' }])
    this.passwordForm = this.utilityService.initalizeForm([{ key: 'password',  required: true, type: 'password' }])

    const params = this.activatedRoute.snapshot.queryParams;
    // Handle oAuth Redirect Callback URL Code
    if(params && params['code']) {
      let data = await this.userService.getLoginToken(params['code'])
      if(data && data.user) {
        this.router.navigate(['/home']); // Navigate to Baskets Page (TODO - Dashboard Page)
      }
      else {
        this.utilityService.displayInfoMessage(JSON.stringify(data), true);
      }
    }
    else if(params && params['token']) {
      let token = await this.userService.verifyPasswordResetToken(params['token'])
      // If we have contact record returned, authentication has succeeded
      if(token && token.success) {
        this.utilityService.displayInfoMessage(`Welcome back ${token.firstName}!  Please set your new password.`);
        this.mode = 'resetPassword';
        this.passwordResetToken = params['token'];
      }
      else {
        // TODO: Better Login Error Messaging
        this.utilityService.displayInfoMessage("This link has expired.  Please confirm your link and try again.", true);
      }
    }
  }

  login() {
    this.router.navigate(['/login']);
  }

  async sendPasswordResetEmail() {
    // Send forgot password link to input email address
    let result = await this.userService.sendPasswordResetEmail(this.emailForm.getRawValue().email)
    if(result && result.data && result.data.MessageId) {
      this.utilityService.displayInfoMessage("Email sent.  Please check your inbox and follow the link to reset your password.", false, 20000);
    }
    else {
      this.utilityService.displayInfoMessage(JSON.stringify(result.error), true);
    }
  }

  async resetPassword() {
    // Reset the users passsword
    let result = await this.userService.resetPassword(this.passwordResetToken, this.passwordForm.getRawValue().password)
    if(result && result.success && !result.error) {
      this.utilityService.displayInfoMessage('Password Reset.  Please login using your new password to continue accessing the portal.');
      this.router.navigate(['/login']);
    }
    else {
      this.utilityService.displayInfoMessage(JSON.stringify(result.error), true);
    }
  }

  signup() {
    this.router.navigate(['/sign-up']);
  }
}
