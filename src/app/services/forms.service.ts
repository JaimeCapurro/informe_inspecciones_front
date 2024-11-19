import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

import { Forms } from '../models/forms';
import { RequestResponse } from '../models/requestResponse';


@Injectable({
    providedIn: 'root'
  })
export class FormsService {
    form: Forms;
    

    constructor(private http: HttpClient) {}

    findForm(ID: number): Observable<RequestResponse> {
        return this.http.get<RequestResponse>(`${environment.apiUrl}forms/getOneByID/${ID}`);
    };

    findAllForms(): Observable<RequestResponse> {
        return this.http.get<RequestResponse>(`${environment.apiUrl}forms/getAll`);
    };

    updateForm(ID: number, form: Forms): Observable<RequestResponse> {
        return this.http.put<RequestResponse>(`${environment.apiUrl}forms/updateForm/${ID}`, { form });
    };

    createForm( pdf: FormData): Observable<RequestResponse> {
        return this.http.post<RequestResponse>(`${environment.apiUrl}forms/createForm`, pdf );
    };

}