import { Component, OnInit } from '@angular/core';

import { TestService } from '../test/test.service';

import { Test, Question, Option } from '../../shared/models';

import { Router } from '@angular/router';
import { NgClass, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [NgClass, NgIf, NgFor],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.css'
})
export class SummaryComponent implements OnInit {
  test: Test | null = null;
  totalScore = 0;
  totalQuestions = 0;
  questionsAttempted = 0;
  avgTimePerQuestion = 0;

  constructor(private testService: TestService, private router: Router) { }

  ngOnInit() {
    const latestTest = this.testService.getLatestTest();
    if (latestTest) {
      this.test = latestTest;
      this.calculateSummary();
    } else {
      this.router.navigate(['/']);
    }
  }

  calculateSummary() {
    if (!this.test) return;

    this.totalQuestions = this.test.sections.reduce((total, section) => total + section.questions.length, 0);
    this.questionsAttempted = this.test.sections.reduce((total, section) =>
      total + section.questions.filter(q => q.userAnswers.length > 0).length, 0);

    this.totalScore = this.test.sections.reduce((total, section) =>
      total + section.questions.filter(q => this.isQuestionCorrect(q)).length, 0);

    const totalTime = (this.test.endTime as number) - this.test.startTime;
    this.avgTimePerQuestion = Math.round(totalTime / (this.totalQuestions * 1000));
  }

  isQuestionCorrect(question: Question): boolean {
    return JSON.stringify(question.userAnswers.sort()) === JSON.stringify(question.correctAnswers.sort());
  }

  isOptionSelected(question: Question, option: Option): boolean {
    return question.userAnswers.includes(option.id);
  }

  isCorrectAnswer(question: Question, option: Option): boolean {
    return question.correctAnswers.includes(option.id);
  }

  isIncorrectAnswer(question: Question, option: Option): boolean {
    return this.isOptionSelected(question, option) && !this.isCorrectAnswer(question, option);
  }

  goToHome() {
    this.router.navigate(['/']);
  }
}

