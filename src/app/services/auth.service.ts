import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private apiUrl = `${environment.apiUrl}login`

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(this.apiUrl, { username, password }).pipe(
        tap((response: any) => {
            localStorage.setItem('token', response.token);
            this.isAuthenticated = true;
        })
    );
  }

  logout() {
      localStorage.removeItem('token');
      this.isAuthenticated = false;
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    const decodedToken: any = jwtDecode(token);
    const isExpired = decodedToken.exp * 1000 < Date.now();
    return !isExpired;
  }

  getUserIdFromToken(): string | null {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('No token?');
      return null; // No hay token
    }
  
    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.user_id || null; 
    } catch (error) {
      console.error('Failed to decode token', error);
      return null;
    }
  }

  getUsernameFromToken(): string | null {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('No token?');
      return null; // No hay token
    }
  
    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.username || null; 
    } catch (error) {
      console.error('Failed to decode token', error);
      return null;
    }
  }

  getUserRolFromToken(): string | null {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('No token?');
      return null; // No hay token
    }
  
    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.rol || null; 
    } catch (error) {
      console.error('Failed to decode token', error);
      return null;
    }
  }
}
