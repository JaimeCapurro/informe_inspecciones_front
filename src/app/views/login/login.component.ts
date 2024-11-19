import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ModalLoginComponent } from '../modal-login/modal-login.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private userService: UsersService, 
    private authService: AuthService, 
    private fb: FormBuilder,
    private router: Router,
    public dialog: MatDialog) {
    this.loginForm = this.fb.group({
      user: '',
      pword: ''
    });
  }

  async login() {
    let username = this.loginForm.get('user')?.value;
    let password = this.loginForm.get('pword')?.value;
    
    if (username && password) {
      try{
        const response = await this.authService.login(username, password).toPromise();
        if (response.success && response.message !== 'Invalid credentials') {
          console.log('Success');
          this.router.navigate(['form'])
        }
        else if (response.success && response.message === 'Invalid credentials') {
          this.openModal();
        } 
      }catch(e) {
        console.log('error', e);
      }
    }
    
  };

  openModal(): void {
    try {
      const dialogRef = this.dialog.open(ModalLoginComponent, {});
      dialogRef.afterClosed().subscribe(res => {
        console.log(res);
      });
    }
    catch (error) {
      console.error('Error', error);
    }
    
  };

}
