import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function createPasswordStrengthValidator(): ValidatorFn {
  return (control:AbstractControl) : ValidationErrors | null => {

    const value = control.value;

    if (!value) {
      return null;
    }

    const hasLetter = /[a-zA-Z]+/.test(value);

    const hasNumeric = /[0-9]+/.test(value);

    const passwordValid = hasLetter && hasNumeric;

    return !passwordValid ? { passwordStrength: true } : null;
  }
}
