import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'https://api.mon-gamestore.com/auth';
  
  // Utilisation d'un BehaviorSubject pour diffuser l'état de l'utilisateur en temps réel dans l'app
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Restauration de la session si elle existe (par exemple stockée en localStorage ou via cookie)
    const savedUser = localStorage.getItem('user_session');
    if (savedUser) this.currentUserSubject.next(JSON.parse(savedUser));
  }

  // Traduit le processus de AuthController::login()
  login(credentials: { email: string; password: string }): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login.php`, credentials).pipe(
      tap(user => {
        localStorage.setItem('user_session', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  // Traduit le processus de AuthController::register()
  register(userData: any): Observable<{ success: boolean; errors?: string[] }> {
    return this.http.post<{ success: boolean; errors?: string[] }>(`${this.apiUrl}/register.php`, userData);
  }

  // Traduit AuthController::logout()
  logout(): void {
    localStorage.removeItem('user_session');
    this.currentUserSubject.next(null);
  }

  // Helpers pour nos Guards
  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  isAdmin(): boolean {
    return this.currentUserSubject.value?.role === 'admin';
  }
}