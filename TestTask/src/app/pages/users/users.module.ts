import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

import { UiButtonComponent } from '@shared/components/ui-button/ui-button.component';

import { UsersRoutingModule } from './users-routing.module';
import { UsersService } from './services/users.service';
import { UsersPageComponent } from './users-page.component';
import { UsersListComponent } from './components/users-list/users-list.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { UiInputComponent } from '@shared/components/ui-input/ui-input.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    UsersListComponent,
    UsersPageComponent,
    UserFormComponent,
  ],
    imports: [
      CommonModule,
      UsersRoutingModule,
      UiButtonComponent,
      NgOptimizedImage,
      ReactiveFormsModule,
      UiInputComponent
    ],
  providers: [
    UsersService
  ]
})
export class UsersModule { }
