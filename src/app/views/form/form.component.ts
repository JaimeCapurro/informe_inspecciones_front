import { Component, CUSTOM_ELEMENTS_SCHEMA, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialog } from '@angular/material/dialog';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { generatePdfTemplate } from '../../../assets/pdf-template';
import { DrawingCanvasModule } from '../drawing-canvas/drawing-canvas.module';
import { FormsService } from '../../services/forms.service';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { ModalGenerateFormComponent } from '../modal-generate-form/modal-generate-form.component';




@Component({
    selector: 'app-form',
    standalone: true,
    imports: [  FormsModule, 
                MatButtonModule, 
                MatInputModule, 
                MatRadioModule,
                MatCardModule,
                MatFormField,
                MatGridListModule,
                MatDividerModule,
                MatButtonToggleModule,
                CommonModule,
                DrawingCanvasModule,
                RouterModule,
                NavbarComponent,
            ],
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.css'],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FormComponent {

    constructor(private formService: FormsService, private dialog: MatDialog) {}

    imgArray= [];
    b64ImgArray = [];

    observaciones: string = '';
    //cols de mat-list-grid breakpoints
    //col1= 2; //cols 2
    //col2= 4; //cols 4
    //col3= 8; //cols 8

    selectedPhoto: File | null= null;
    fotos= [];

    //form controls de los radio btn group
    //ITEM 1 
    direccion_value: string | null = null; cinturon_value: string | null = null;
    carroceria_value: string | null = null; bocina_value: string | null = null;
    aire_calefaccion_value: string | null = null; asientos_cabina_value: string | null = null;
    limpiaparabrisas_value: string | null = null; frenos_value: string | null = null;
    neumaticos_value: string | null = null; tablero_value: string | null = null;
    parabrisas_ventanas_value: string | null = null; puertas_bisagras_value: string | null = null;
    //ITEM 2
    extintor_value: string | null = null; triangulos_value: string | null = null;
    botiquin_value: string | null = null; gata_value: string | null = null;
    chaleco_value: string | null = null; tuercas_value: string | null = null;
    kit_invierno_value: string | null = null; neumaticos_repuesto_value: string | null = null;
    //ITEM 3
    luces_traseras_value: string | null = null; luces_delanteras_value: string | null = null;
    luces_direccionales_value: string | null = null; neblineros_value: string | null = null;
    balizas_value: string | null = null;
    //ITEM 4
    habitaculo_value: string | null = null;carroceria_gabinete_value: string | null = null;
    //ITEM 5
    revision_tecnica_value: string | null = null; permiso_circulacion_value: string | null = null;
    licencia_conducir_value: string | null = null;
    //ITEM 6
    bateria_fusibles_value: string | null = null; correas_filtro_value: string | null = null;
    niveles_value: string | null = null; filtro_particulas_value: string | null = null;
    //ITEM 7
    winche_control_value: string | null = null; mobileye_value: string | null = null;
    soporte_extintores_value: string | null = null;
    //ITEM 8
    punto1_fatiga_value: string | null = null; punto2_fatiga_value: string | null = null;
    punto3_fatiga_value: string | null = null; punto4_fatiga_value: string | null = null;
    //FIRMAS
    inputFirmaConductor: any | null = null; inputFirmaAcompanante: any | null = null;
    

    col1 = window.innerWidth < 600 ? 1 : 2;
    col2 = window.innerWidth < 600 ? 2 : 4;
    col3 = window.innerWidth < 600 ? 4 : 8;

    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        this.setCols(event.target.innerWidth);
    };

    setCols(width: number) {
        if (width < 600) {
            this.col1 = window.innerWidth < 600 ? 1 : 2;
            this.col2 = window.innerWidth < 600 ? 2 : 4;
            this.col3 = window.innerWidth < 600 ? 4 : 8;
        }
        else {
            this.col1 = 2;
            this.col2 = 4;
            this.col3 = 8;
        }
    };

    async generatePDF(form: any) {
        const docDefinition: any = await generatePdfTemplate(form.value);
        const pdf = await pdfMake.createPdf(docDefinition);
        
        await pdf.getBlob(async (blob) => {
            //MANDAR PDF A LA DB
            //const id_user = parseInt(await this.authService.getUserIdFromToken());
            //console.log(blob.size)
            const data = new FormData;
            data.append('ID', "1")
            data.append('pdf', blob);
            
            const response = await this.formService.createForm(data).toPromise();
            if ( response.success ) {
                //MANDAR PDF POR CORREO
            }
        });
        
        pdf.open();
    };

    uploadImg(event: Event) {
        const foto = event.target as HTMLInputElement;
        if (foto && foto?.files) {
            const file = foto.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64 = e.target?.result as string;
                this.b64ImgArray.push(base64);
                //const imgBlob = this.base64ToBlob(base64, 'image/jpeg');
                this.imgArray.push(base64);
            };
            reader.readAsDataURL(file);
        } else {
            alert('Suba una foto');
        }
    };

    onFirmaConductorReceived(imageData: string) {
        this.inputFirmaConductor = imageData;
        console.log("received");
    };

    onFirmaAcompananteReceived(imageData: string){
        this.inputFirmaAcompanante = imageData;
        console.log("received");
    };

    base64ToBlob (base64: string, mimeType: string) {
        const byteCharacters = atob(base64.split(',')[1]);  // Remove 'data:image/jpeg;base64,' prefix
        const byteArrays = [];
    
        for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
            const slice = byteCharacters.slice(offset, offset + 1024);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            byteArrays.push(new Uint8Array(byteNumbers));
        }
    
        return new Blob(byteArrays, { type: mimeType });
    };

    openModal(form: any): void {
    const dialogRef = this.dialog.open(ModalGenerateFormComponent, {
        width: '400px',
        data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
            if (result === 'GenPDF') {
                this.generatePDF(form);
            }
        });
    }
}