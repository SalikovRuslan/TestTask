import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function confirmPasswordValidator(compareControlName: string): ValidatorFn {
  return (control:AbstractControl) : ValidationErrors | null => {
    const value = control.value;
    const compareControl =
      control.parent?.get(compareControlName) ? control.parent?.get(compareControlName) : null

    if (!value || !compareControl) {
      return null;
    }

    if (value !== compareControl.value) {
      return { confirmPassword: true }
    }

    return null;
  }
}
