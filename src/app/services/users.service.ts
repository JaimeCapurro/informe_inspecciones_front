import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

import { Users } from '../models/users';
import { RequestResponse } from '../models/requestResponse';


@Injectable({
    providedIn: 'root'
})
export class UsersService {
    user: Users;

    constructor(private http: HttpClient) {}

    findUser(ID: number): Observable<RequestResponse> {
        return this.http.get<RequestResponse>(`${environment.apiUrl}users/getOneByID/${ID}`);
    };

    findUserByName(ID: string): Observable<RequestResponse> {
        return this.http.get<RequestResponse>(`${environment.apiUrl}users/getOneByName/${ID}`);
    };

    findAllUsers(): Observable<RequestResponse> {
        return this.http.get<RequestResponse>(`${environment.apiUrl}users/getAll`);
    };

    updateUser(ID: number, user: Users): Observable<RequestResponse> {
        return this.http.put<RequestResponse>(`${environment.apiUrl}users/updateUser/${ID}`, { user });
    };

    createUser(user: FormData): Observable<RequestResponse> {
        return this.http.post<RequestResponse>(`${environment.apiUrl}users/createUser`, user );
    };

}

