import { Component, Inject, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ModalLogoutComponent } from '../modal-logout/modal-logout.component';
import { MatDialogModule, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    CommonModule,
    RouterOutlet,
    RouterModule,
    MatButtonModule,
    MatDialogModule,

  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  isUserAdmin: boolean;

  constructor( 
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog
    ) {}

  ngOnInit(): void {
    this.checkUserRol();
  }

  async logout() {
    try {
      await this.authService.logout();
      this.router.navigate([''])
    } catch (error) {
      console.error('Error loging out', error);
    }
  };

  async checkUserRol() {
    const rol = await this.authService.getUserRolFromToken();
    if (rol === '1') {
      this.isUserAdmin = true;
    }
    else {
      this.isUserAdmin = false;
    }
  };

  openModal(): void {
    try {
      const dialogRef = this.dialog.open(ModalLogoutComponent, {});
      dialogRef.afterClosed().subscribe(res => {
        console.log(res);
      });
    }
    catch (error) {
      console.error('Error', error);
    }
    
  };
}
