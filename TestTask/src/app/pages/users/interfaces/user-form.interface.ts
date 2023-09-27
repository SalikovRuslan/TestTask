import { FormControl } from '@angular/forms';

import { UserTypeEnum } from '../enums/user-type.enum';

export interface IUserForm {
  username: FormControl<string>;
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  email: FormControl<string>;
  userType: FormControl<UserTypeEnum>;
  password: FormControl<string>;
  repeatedPassword: FormControl<string>;
}
