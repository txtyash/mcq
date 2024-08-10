import { Component } from '@angular/core';
import { TestService } from './test.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { Test, Question, Section } from '../../shared/models';

import { OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { takeWhile } from 'rxjs';
import { interval } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { NgClass, NgFor, NgIf } from '@angular/common';
import Swal from 'sweetalert2';
import { timer } from 'rxjs';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [FormsModule, NgFor, NgClass, NgIf],
  templateUrl: './test.component.html',
})
export class TestComponent implements OnInit, OnDestroy {
  test: Test | null = null;
  currentSection: Section | null = null;
  currentQuestion: Question | null = null;
  currentSectionIndex = 0;
  currentQuestionIndex = 0;
  private timerSubscription: Subscription | null = null;
  private testDuration = 30 * 60 * 1000;
  timeRemaining: string = '';

  constructor(private testService: TestService, private router: Router) { }

  ngOnInit() {
    console.log('TestComponent initialized');
    this.testService.startTest();
    this.testService.currentTest$.subscribe(test => {
      if (test) {
        console.log('Test started:', test);
        this.test = test;
        this.currentSection = test.sections[this.currentSectionIndex];
        this.updateCurrentQuestion();
        this.startTimer();
      }
    });
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  startTimer() {
    const endTime = Date.now() + this.testDuration;
    this.timerSubscription = timer(0, 1000)
      .pipe(takeUntil(timer(this.testDuration)))
      .subscribe(() => {
        const remaining = endTime - Date.now();
        console.log(remaining);
        if (remaining <= 1000) {
          this.autoSubmit();
        } else {
          this.updateTimeRemaining(remaining);
        }
      });
  }

  updateTimeRemaining(remaining: number) {
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    this.timeRemaining = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  stopTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  autoSubmit() {
    console.log('Time\'s up! Auto-submitting test');
    this.stopTimer();
    this.testService.submitTest();
    Swal.fire({
      title: 'Time\'s up!',
      text: 'Your test has been automatically submitted.',
      icon: 'info',
      confirmButtonText: 'OK'
    }).then(() => {
      this.router.navigate(['/summary']);
    });
  }

  submitTest() {
    console.log('Manually submitting test');
    this.stopTimer();
    this.testService.submitTest();
    this.router.navigate(['/summary']);
  }

  onAnswer() {
    if (this.currentQuestion) {
      if (this.currentQuestion.type === 'single') {
        this.testService.answerQuestion(this.currentQuestion.id, this.currentQuestion.userAnswers);
      } else if (this.currentQuestion.type === 'multiple') {
        const selectedAnswers = this.currentQuestion.options
          .filter(option => option.checked)
          .map(option => option.id);
        this.testService.answerQuestion(this.currentQuestion.id, selectedAnswers);
      }
    }
  }


  updateCurrentQuestion() {
    if (this.currentSection) {
      this.currentQuestion = this.currentSection.questions[this.currentQuestionIndex];
      if (this.currentQuestion) {
        this.currentQuestion.options.forEach(option => {
          option.checked = this.currentQuestion!.userAnswers.includes(option.id);
        });
      }
    }
  }


  onMultiAnswer(optionId: string) {
    if (this.currentQuestion && this.currentQuestion.type === 'multiple') {
      const option = this.currentQuestion.options.find(o => o.id === optionId);
      if (option) {
        option.checked = !option.checked;
        this.currentQuestion.userAnswers = this.currentQuestion.options
          .filter(o => o.checked)
          .map(o => o.id);
        this.onAnswer();
      }
    }
  }



  markForReview() {
    if (this.currentQuestion) {
      this.testService.markForReview(this.currentQuestion.id);
    }
  }

  nextQuestion() {
    if (this.currentSection && this.currentQuestionIndex < this.currentSection.questions.length - 1) {
      this.currentQuestionIndex++;
    } else if (this.test && this.currentSectionIndex < this.test.sections.length - 1) {
      if (!this.isSectionSufficientlyCompleted(this.currentSection!)) {
        Swal.fire({
          title: 'Section Incomplete',
          text: 'Please complete at least 4 of the current section before moving to the next.',
          icon: 'warning',
          confirmButtonText: 'OK'
        });
        return;
      }
      this.currentSectionIndex++;
      this.currentQuestionIndex = 0;
      this.currentSection = this.test.sections[this.currentSectionIndex];
    }
    this.updateCurrentQuestion();
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    } else if (this.currentSectionIndex > 0) {
      this.currentSectionIndex--;
      this.currentSection = this.test!.sections[this.currentSectionIndex];
      this.currentQuestionIndex = this.currentSection.questions.length - 1;
    }
    this.updateCurrentQuestion();
  }

  goToQuestion(sectionIndex: number, questionIndex: number) {
    if (sectionIndex !== this.currentSectionIndex) {
      if (!this.isSectionSufficientlyCompleted(this.currentSection!)) {
        Swal.fire({
          title: 'Section Incomplete',
          text: 'Please complete at least 4 of the current section before moving to the next.',
          icon: 'warning',
          confirmButtonText: 'OK'
        });
        return;
      }
    }
    this.currentSectionIndex = sectionIndex;
    this.currentQuestionIndex = questionIndex;
    this.currentSection = this.test!.sections[this.currentSectionIndex];
    this.updateCurrentQuestion();
  }

  canSubmit(): boolean {
    return this.test ? this.testService.canSubmitTest(this.test) : false;
  }

  getSectionCompletionPercentage(section: Section): number {
    const answeredCount = section.questions.filter(q => q.status === 'answered').length;
    return Math.round((answeredCount / section.questions.length) * 100);
  }

  get hasPrevious(): boolean {
    return this.currentQuestionIndex > 0 || (this.test?.sections.indexOf(this.currentSection!) ?? 0) > 0;
  }

  get hasNext(): boolean {
    if (!this.currentSection || !this.test) return false;
    const isLastQuestionInSection = this.currentQuestionIndex === this.currentSection.questions.length - 1;
    const isLastSection = this.test.sections.indexOf(this.currentSection) === this.test.sections.length - 1;
    return !isLastQuestionInSection || !isLastSection;
  }

  isSectionSufficientlyCompleted(section: Section): boolean {
    const answeredCount = section.questions.filter(q => q.status === 'answered').length;
    return (answeredCount / section.questions.length) >= 0.8;
  }
}
