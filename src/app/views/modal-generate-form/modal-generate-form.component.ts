import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-generate-form',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './modal-generate-form.component.html',
  styleUrl: './modal-generate-form.component.css'
})
export class ModalGenerateFormComponent {

  constructor(
    public dialogRef: MatDialogRef<ModalGenerateFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  };

  onButtonClick() {
    this.dialogRef.close('GenPDF');
  };
}
