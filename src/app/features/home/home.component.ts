import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { AsyncPipe, NgIf, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TestService } from '../test/test.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgIf, AsyncPipe, RouterLink, DatePipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  authService = inject(AuthService);
  testService = inject(TestService);
  showTestInfo: boolean = false;

  testsTaken: number = 0;
  averageScore: number = 0;
  lastTestDate: Date | null = null;

  ngOnInit() {
    this.authService.appState$.subscribe(state => {
      if (state.loggedIn) {
        this.loadTestInformation();
      }
    });
  }

  loadTestInformation() {
    this.testsTaken = this.testService.getTotalTestsTaken();
    this.averageScore = this.testService.getAverageScore();
    this.lastTestDate = this.testService.getLastTestDate();
  }

  logout() {
    this.authService.logout();
  }
}
