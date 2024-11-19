// drawing-canvas.module.ts
import { NgModule, Input } from '@angular/core';
import { DrawingCanvasComponent } from './drawing-canvas.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    DrawingCanvasComponent,
    
  ],
  imports: [
    MatButtonModule,
    MatIconModule
  ],
  exports: [DrawingCanvasComponent] // Export it so it can be used in other modules
})
export class DrawingCanvasModule {
}
