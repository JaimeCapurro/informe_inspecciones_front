import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Config } from 'datatables.net';
import { filter, takeUntil } from 'rxjs/operators';

import { FormsService } from '../../services/forms.service';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../navbar/navbar.component';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import 'bootstrap/dist/css/bootstrap.min.css';


@Component({
  selector: 'app-forms-listing',
  standalone: true,
  imports: [
    CommonModule,
    DataTablesModule,
    NavbarComponent,
    MatCardModule,
    MatButtonModule,

  ],
  templateUrl: './forms-listing.component.html',
  styleUrls: ['./forms-listing.component.css']
})
export class FormsListingComponent implements OnInit, OnDestroy {

  forms: any[];
  dtOptions: Config = {};
  dtTrigger: Subject<any> = new Subject<any>();
  dtElement: DataTableDirective;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private formService: FormsService, 
    private authService: AuthService,
    private router: Router) {}

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers', 
      searching: false,
      language: {
        url: '//cdn.datatables.net/plug-ins/2.1.8/i18n/es-CL.json'
      },
    };

    this.loadForms();

    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd), takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadForms();  // Reload data on navigation back
      });
  };

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe(); 
    this.destroy$.next(true);
    this.destroy$.complete();
  };

  async loadForms(): Promise<void> {
    try {
      const response = await this.formService.findAllForms().toPromise();
      this.forms = await response.data.map(item => ({
        form_id: item.form_id,
        username: item.user.user,
        doc: item.document
      }));

      this.dtTrigger.next(response.data);

    } catch (error) {
      console.error('Error loading forms:', error);
    }
  };

  rerender(): void {
    this.dtElement.dtInstance.then(dtInstance => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next(null);
    });
  }

  openPdf(buffer) {
    //console.log(buffer);
    const uint8Array = new Uint8Array(buffer.data);
    const blob = new Blob([uint8Array], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    window.open(url);
  };

  logFormData(form: any) {
    const uint8Array =new Uint8Array(form.data);
    const blob = new Blob([uint8Array], { type: 'application/pdf' });
    console.log('F: ', blob);
  };
}
