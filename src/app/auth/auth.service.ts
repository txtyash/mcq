import { Injectable } from '@angular/core';
import { AppState } from '../shared/models';
import { inject } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { LocalStorageService } from '../shared/local-storage.service';
import { User, UserWithPassword } from '../shared/models';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _localStorageService = inject(LocalStorageService);
  private _router = inject(Router);

  private _appState = new BehaviorSubject<AppState>({
    loggedIn: false,
    user: null
  });

  appState$ = this._appState.asObservable();

  constructor() {
    this.loadState();
  }

  private loadState(): void {
    const state = this._localStorageService.get<AppState>('appState');
    if (state) {
      this._appState.next(state);
    }
  }

  private saveState(): void {
    this._localStorageService.set('appState', this._appState.value);
  }

  register(user: UserWithPassword): Observable<boolean> {
    const users = this._localStorageService.get<UserWithPassword[]>('users') || [];
    const userExists = users.some(u => u.email === user.email);
    if (userExists) {
      Swal.fire({
        title: 'Error!',
        text: 'User already exists',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return of(false);
    }
    user.id = Date.now().toString();
    users.push(user);
    this._localStorageService.set('users', users);
    Swal.fire({
      title: 'Success!',
      text: 'Registration successful',
      icon: 'success',
      confirmButtonText: 'OK'
    }).then(() => {
      this._router.navigate(['/login']);  // Updated this line
    });
    return of(true);
  }

  login(email: string, password: string): void {
    const users = this._localStorageService.get<UserWithPassword[]>('users') || [];
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      const newState: AppState = { loggedIn: true, user: userWithoutPassword };
      this._appState.next(newState);
      this.saveState();
      this._router.navigate(['/']);
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'Invalid credentials',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }

  logout(): void {
    const newState: AppState = { loggedIn: false, user: null };
    this._appState.next(newState);
    this.saveState();
    this._router.navigate(['/login']);  // Updated this line
  }

  getCurrentUser(): User | null {
    return this._appState.value.user;
  }

  isLoggedIn(): boolean {
    return this._appState.value.loggedIn;
  }
}
