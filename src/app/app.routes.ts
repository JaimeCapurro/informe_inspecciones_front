import { Routes } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { FormComponent } from './views/form/form.component';
import { FormsListingComponent } from './views/forms-listing/forms-listing.component';
import { UsersListingComponent } from './views/users-listing/users-listing.component';
import { CreateUserComponent } from './views/create-user/create-user.component';
import { AuthGuard } from './guards/auth.guard';


const routesConfig: Routes = [
    {
        path: '',
        component: LoginComponent,
        title: 'Login Page'
    },
    {
        path: 'form',
        component: FormComponent,
        title: 'Form Page',
        canActivate: [AuthGuard]
    },
    {
        path: 'forms_list',
        component: FormsListingComponent,
        title: 'Forms Table',
        canActivate: [AuthGuard]
    },
    {
        path: 'users_list',
        component: UsersListingComponent,
        title: 'Users Table',
        canActivate: [AuthGuard]
    },
    {
        path: 'create_user',
        component: CreateUserComponent,
        title: 'Create User',
        canActivate: [AuthGuard]
    }
];


export {routesConfig};