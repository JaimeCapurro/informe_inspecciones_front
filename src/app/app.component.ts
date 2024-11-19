import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import 'bootstrap/dist/css/bootstrap.min.css';

import { LoginComponent } from './views/login/login.component';
import { FormComponent } from './views/form/form.component';
import { FormsListingComponent } from './views/forms-listing/forms-listing.component';
import { NavbarComponent } from './views/navbar/navbar.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, 
    RouterModule, 
    FormComponent, 
    LoginComponent, 
    FormsListingComponent, 
    NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'inspeccion-camionetas';
}
