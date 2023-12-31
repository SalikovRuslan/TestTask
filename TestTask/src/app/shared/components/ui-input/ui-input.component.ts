import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormsModule, NgControl } from '@angular/forms';
import { CommonModule, NgIf, NgOptimizedImage } from '@angular/common';

import { UiValidationErrorComponent } from '@shared/components/ui-validation-error/ui-validation-error.component';

@Component({
  selector: 'app-ui-input',
  templateUrl: './ui-input.component.html',
  styleUrls: ['./ui-input.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, UiValidationErrorComponent, NgIf, NgOptimizedImage],
})
export class UiInputComponent implements ControlValueAccessor, OnInit {
  @Input() label: string = '';
  @Input() name: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() iconPath: string = '';

  public formControl: AbstractControl;

  private innerValue: any = '';
  constructor(private ngControl: NgControl) {
      this.ngControl.valueAccessor = this;
  }

  ngOnInit(): void {
    this.formControl = this.ngControl.control as AbstractControl;
  }

  get value(): any {
    return this.innerValue;
  }

  set value(v: any) {
    if (v !== this.innerValue) {
      this.innerValue = v;
      this.onChangeCallback(v);
    }
  }

  writeValue(value: any): void {
    if (value !== this.innerValue) {
      this.innerValue = value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  onBlur(): void {
    this.onTouchedCallback();
  }

  private onChangeCallback(_: any) {}
  private onTouchedCallback() {}

  hasError(): boolean {
    return this.formControl
      ? this.formControl.invalid && (this.formControl.dirty || this.formControl.touched)
      : false;
  }
}
