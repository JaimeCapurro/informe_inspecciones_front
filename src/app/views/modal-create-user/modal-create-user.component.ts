import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-create-user',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './modal-create-user.component.html',
  styleUrl: './modal-create-user.component.css'
})
export class ModalCreateUserComponent {

  constructor(
    public dialogRef: MatDialogRef<ModalCreateUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  };

  onButtonClick() {
    this.dialogRef.close('createUser');
  };
}
