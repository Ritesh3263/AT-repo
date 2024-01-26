import {Component, Inject} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UtilitiesService} from "../../../../../services/utilities.service";
import {AdminService} from "../../../../../services/admin.service";

@Component({
  selector: 'app-edit-broker',
  templateUrl: './edit-broker.component.html',
  styleUrls: ['./edit-broker.component.scss']
})
export class EditBrokerComponent {
  form: FormGroup = new FormGroup('')
  mode = 'EDIT'
  selectedFile!: File
  selectedFileURL!: any
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public utilityService: UtilitiesService, private dialogRef: MatDialogRef<EditBrokerComponent>, private adminService: AdminService) { }

  ngOnInit() {
    this.mode = this.data.mode

    let formFields = [{
        key: 'name',
        enableUpdate: true,
        required: true
      },
      {
        key: 'broker_code',
        enableUpdate: true,
        required: false
      },
      {
        key: 'active',
        enableUpdate: true,
        required: false
      }
    ]

    this.form = this.utilityService.initalizeForm(formFields, this.data.broker || {})
  }

  async save() {
    let broker = this.form.getRawValue()
    broker.id = this.data.broker ? this.data.broker.id : null;

    let results = await this.adminService.setBroker(broker, this.selectedFile);
    if(results && results.success) {
      this.utilityService.displayInfoMessage("Brokerage Saved!")
      this.dialogRef.close({success: true})
    }
    else {
      if(results && results.message)
        this.utilityService.displayInfoMessage(results.message, true)
      else
        this.utilityService.displayInfoMessage(JSON.stringify(results), true)
    }
  }

  onFileSelected(event: any) {
    const file:File = event.target.files[0];
    this.selectedFile = file
    const self = this

    const reader = new FileReader();

    reader.onloadend = function() {
      self.selectedFileURL = reader.result
     }

    reader.readAsDataURL(file);
  }
}
