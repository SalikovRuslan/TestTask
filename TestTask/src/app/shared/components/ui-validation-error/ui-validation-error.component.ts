import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-ui-validation-error',
  templateUrl: './ui-validation-error.component.html',
  styleUrls: ['./ui-validation-error.component.scss'],
  standalone: true,
  imports: [CommonModule, NgIf],
})
export class UiValidationErrorComponent {
  @Input() ngControl: AbstractControl;
  constructor() {}
}
