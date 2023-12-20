import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.scss']
})
export class InputTextComponent {
  @Input() label!: string
  @Input() formGroup!: FormGroup
  @Input() field!: string
  constructor(public utilityService: UtilitiesService) {  }
}
