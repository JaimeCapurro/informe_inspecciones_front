import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-modal-logout',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    RouterModule
  ],
  templateUrl: './modal-logout.component.html',
  styleUrl: './modal-logout.component.css'
})
export class ModalLogoutComponent {

  constructor( 
    private authService: AuthService,
    private router: Router,
    public dialogRef: MatDialogRef<ModalLogoutComponent>
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  async logout() {
    try {
      await this.authService.logout();
      this.dialogRef.close();
      this.router.navigate([''])
    } catch (error) {
      console.error('Error loging out', error);
    }
  };
}
