import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../auth/auth.service';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private _authService = inject(AuthService);

  isAuthneticated() {
    return this._authService.isLoggedIn();
  }

  logout() {
    this._authService.logout();
  }
}
