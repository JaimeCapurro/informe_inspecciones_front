import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import * as bcrypt from 'bcryptjs';
import { ModalCreateUserComponent } from '../modal-create-user/modal-create-user.component';
import { MatDialog } from '@angular/material/dialog';



@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [
    NavbarComponent,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatFormField,
    MatInputModule,
    MatCheckboxModule,
  ],
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent {

  constructor(
    private authService: AuthService, 
    private userService: UsersService,
    private dialog: MatDialog) {}

  isAdmin: boolean = false;

  async createUser(userForm: any) {
    const data = new FormData();
    let pword;
    let encrypted_pword;

    if(userForm.value.pword1 === userForm.value.pword2) {
      pword = userForm.value.pword1;
      encrypted_pword = await this.hashPassword(pword);

    } else {
      console.log('Error: las contraseñas no son las mismas');
      return
    }

    let rol = this.isAdmin ? '1' : '0';
    const userAt = await this.authService.getUsernameFromToken();

    data.append('user', userForm.value.username);
    data.append('pword', encrypted_pword);
    data.append('nombre', userForm.value.name);
    data.append('rol', rol);
    data.append('userAt', userAt);

    const response = await this.userService.createUser(data).toPromise();
    if ( response.success ) {
      console.log('success');
    }

  }

  hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const saltRounds = 10;  
      bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
          reject('Error hashing password: ' + err);  
        } else {
          resolve(hash);
        }
      });
    });
  }

  openModal(userForm: any): void {
    const dialogRef = this.dialog.open(ModalCreateUserComponent, {
        width: '400px',
        data: {},
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'createUser') {
          this.createUser(userForm);
      }
  });
  }

}
