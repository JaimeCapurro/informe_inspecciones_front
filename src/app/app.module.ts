import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { PdfViewerModule } from 'ng2-pdf-viewer';


// Componentes
import { AppComponent } from "./app.component";
import { FormComponent } from "./views/form/form.component";
import { LoginComponent } from "./views/login/login.component";
import { FormsListingComponent } from "./views/forms-listing/forms-listing.component";

//Angular Material
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatRadioModule } from "@angular/material/radio";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';

import { DataTablesModule } from 'angular-datatables';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavbarComponent } from "./views/navbar/navbar.component";
import { ModalLogoutComponent } from "./views/modal-logout/modal-logout.component";
import { MatDialogModule } from "@angular/material/dialog";


@NgModule({
    declarations: [],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        MatButtonModule,
        MatInputModule,
        MatRadioModule,
        MatCardModule,
        MatFormFieldModule,
        MatGridListModule,
        MatDividerModule,
        PdfViewerModule,
        ReactiveFormsModule,
        DataTablesModule,
        MatToolbarModule,
        MatDialogModule,

        LoginComponent,
        FormComponent,
        FormsListingComponent,
        NavbarComponent,
        ModalLogoutComponent,

    ],

    
})
export class AppModule {}