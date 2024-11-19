import { 
  Component, 
  ViewChild, 
  ElementRef, 
  AfterViewInit, 
  Input, 
  forwardRef, 
  Output, 
  EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-drawing-canvas',
  //standalone: true,
  templateUrl: './drawing-canvas.component.html',
  styleUrls: ['./drawing-canvas.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DrawingCanvasComponent),
    multi: true
  }]
})
export class DrawingCanvasComponent implements AfterViewInit {
  @ViewChild('drawingCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @Output() firmaData = new EventEmitter<string>();
  private ctx!: CanvasRenderingContext2D;
  private isDrawing = false;
  private lastX = 0;
  private lastY = 0;


  //requerido para ControlValueAccessor
  onChange: any = () => {};
  onTouch: any = () => {};

  ngAfterViewInit(): void {
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
    this.initializeDrawing();
  }

  initializeDrawing(): void {
    const canvas = this.canvasRef.nativeElement;
    canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
    canvas.addEventListener('mouseup', () => this.stopDrawing());
    canvas.addEventListener('mousemove', (e) => this.draw(e));
    canvas.addEventListener('dblclick', () => this.clearCanvas());
  }

  private startDrawing(event: MouseEvent): void {
    this.isDrawing = true;
    [this.lastX, this.lastY] = [event.offsetX, event.offsetY]; // Store the last mouse position
  }

  private stopDrawing(): void {
    this.isDrawing = false;
  }

  private draw(event: MouseEvent): void {
    if (!this.isDrawing) return; // Stop the function if not drawing
    this.ctx.beginPath(); // Start a new path
    this.ctx.moveTo(this.lastX, this.lastY); // Move to the last mouse position
    this.ctx.lineTo(event.offsetX, event.offsetY); // Draw a line to the current mouse position
    this.ctx.stroke(); // Apply the stroke
    [this.lastX, this.lastY] = [event.offsetX, event.offsetY]; // Update the last mouse position
  }

  public clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height); // Clear the entire canvas
  }

  public saveCanvas() {
    const savedCanvas = this.canvasRef.nativeElement as HTMLCanvasElement;
    const dataUrl = savedCanvas.toDataURL('image/png');
    this.firmaData.emit(dataUrl);

    console.log("saved");

  }

  @Input() firma: string | undefined;

  writeValue(value: any): void {
    const canvas= value;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }


}
