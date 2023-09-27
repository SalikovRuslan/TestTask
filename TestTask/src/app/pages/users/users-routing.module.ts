import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersPageComponent } from './users-page.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { userResolver } from './resolvers/user.resolver';


const routes: Routes = [
  {
    path: '',
    component: UsersPageComponent,
    children: [
      {
        path: 'form',
        component: UserFormComponent,
      },
      {
        path: 'form/:username',
        component: UserFormComponent,
        resolve: { user: userResolver },
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
