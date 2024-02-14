import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {FormControl, Validators, FormGroup} from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { BrokerageService } from 'src/app/services/brokerage.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  mode: string = 'verifyEmail';

  signupToken: string = "";

  emailForm: FormGroup = new FormGroup('')
  signupForm: FormGroup = new FormGroup('')

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private userService: UserService, public utilityService: UtilitiesService,private brokerageService:BrokerageService) {  }

  async ngOnInit() {
    let signupFormSchema = [
      { key: 'email',  required: true },
      { key: 'firstName',  required: true },
      { key: 'lastName',  required: true },
      { key: 'password',  required: true, type: 'password' }
    ]
    this.emailForm = this.utilityService.initalizeForm([{ key: 'email',  required: true, type: 'email' }])

    const params = this.activatedRoute.snapshot.queryParams;
    // Handle oAuth Redirect Callback URL Code
    if(params && params['token']) {
      let token = await this.userService.verifyPasswordResetToken(params['token'])
      // If we have contact record returned, authentication has succeeded
      if(token && token.success) {
        this.utilityService.displayInfoMessage(`Welcome back!  Please complete your registration.`);
        this.mode = 'signup';
        this.signupToken = params['token'];
        this.signupForm = this.utilityService.initalizeForm(signupFormSchema, token)
      }
      else {
        // TODO: Better Login Error Messaging
        this.utilityService.displayInfoMessage("This link has expired.  Please request another signup link.", true);
      }
    }
  }

  login() {
    this.router.navigate(['/login']);
  }

  async sendEmailVerificationEmail() {
    // Send verification email to input email address
    let result = await this.userService.sendEmailVerificationEmail(this.emailForm.getRawValue().email)
    if(result && result.data && result.data.MessageId) {
      this.utilityService.displayInfoMessage("Email sent.  Please check your inbox and follow the link to complete your registration.", false, 20000);
    }
    else {
      this.utilityService.displayInfoMessage(JSON.stringify(result.error), true);
    }
  }

  async signup() {
    // Reset the users passsword
    let result = await this.userService.signup(this.signupToken, this.signupForm.getRawValue())
    if(result && result.success && !result.error) {
      this.utilityService.displayInfoMessage('Registration Completed!');
      this.brokerageService.getSync().then((data: any) => {}); //  (TODO--Multiple brokerage handling)
      this.router.navigate(['/baskets']);
    }
    else {
      this.utilityService.displayInfoMessage(JSON.stringify(result.message || result.error), true);
    }
  }
}