import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Config } from 'datatables.net';
import { filter, takeUntil } from 'rxjs/operators';

import { UsersService } from '../../services/users.service';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../navbar/navbar.component';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import 'bootstrap/dist/css/bootstrap.min.css';

@Component({
  selector: 'app-users-listing',
  standalone: true,
  imports: [
    CommonModule,
    DataTablesModule,
    NavbarComponent,
    MatCardModule,
    MatButtonModule,
  ],
  templateUrl: './users-listing.component.html',
  styleUrls: ['./users-listing.component.css']
})
export class UsersListingComponent implements OnInit, OnDestroy {

  users: any[];
  dtOptions: Config = {};
  dtTrigger: Subject<any> = new Subject<any>();
  dtElement: DataTableDirective;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private userService: UsersService,
    private authService: AuthService,
    private router: Router) {}

    ngOnDestroy(): void {
      this.dtTrigger.unsubscribe(); 
      this.destroy$.next(true);
      this.destroy$.complete();
    };

    ngOnInit(): void {
      this.dtOptions = {
        pagingType: 'full_numbers', 
        searching: false,
        language: {
          url: '//cdn.datatables.net/plug-ins/2.1.8/i18n/es-CL.json'
        },
      };
      
      this.loadUsers();

      this.router.events
      .pipe(filter(e => e instanceof NavigationEnd), takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadUsers();  // Reload data on navigation back
      });
    };

    async loadUsers(): Promise<void> {
      try {
        const response = await this.userService.findAllUsers().toPromise();
        this.users = await response.data.map(item => ({
          user_id: item.user_id,
          username: item.user,
          name: item.nombre,
          role: item.rol === '1' ? 'Admin' : 'User'
        }));

        this.dtTrigger.next(response.data);

      } catch (error) {
        console.error('Error loading users:', error);
      }
    }

}
