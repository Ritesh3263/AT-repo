import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup} from '@angular/forms';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent {
  form: FormGroup = new FormGroup('')
  mode: string = 'CREATE'

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public utilityService: UtilitiesService, private dialogRef: MatDialogRef<FeedbackComponent>, private userService: UserService) { }

  ngOnInit() {
    this.mode = this.data && this.data.mode ? this.data.mode: 'CREATE'
    let formFields = [{
        key: 'brokerageName',
        required: true
      },
      {
        key: 'isWebsiteEasy',
        required: true
      },
      {
        key: 'featuresLiked'
      },
      {
        key: 'featuresWanted'
      },
      {
        key: 'suggestions'
      }
    ]

    this.form = this.utilityService.initalizeForm(formFields, this.data.formData)
  }

  async submitFeedback() {
    let results = await this.userService.submitFeedbackForm(this.form.getRawValue());
    if(results && results.success && results.results) {
      this.utilityService.displayInfoMessage("Thank you for your feedback!")
      this.dialogRef.close({success: true})
    }
    else {
      this.utilityService.displayInfoMessage("Uable to submit form at this time.", true)
    }
  }
}
