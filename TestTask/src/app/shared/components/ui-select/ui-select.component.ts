import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormsModule, NgControl } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';

import { UiValidationErrorComponent } from '@shared/components/ui-validation-error/ui-validation-error.component';

export interface ISelectValue {
  value: any;
  title: string;
}

@Component({
  selector: 'app-ui-select',
  templateUrl: './ui-select.component.html',
  styleUrls: ['./ui-select.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, UiValidationErrorComponent, NgIf],
})
export class UiSelectComponent implements ControlValueAccessor, OnInit {
  @Input() label: string = '';
  @Input() name: string = '';
  @Input() values: ISelectValue[];

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
    console.log(v)
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
