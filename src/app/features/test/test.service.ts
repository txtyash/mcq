import { Injectable } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { LocalStorageService } from '../../shared/local-storage.service';
import { BehaviorSubject } from 'rxjs';
import { Test, Section, Question } from '../../shared/models';
import { QUESTIONS } from './question-data';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  private currentTest = new BehaviorSubject<Test | null>(null);
  currentTest$ = this.currentTest.asObservable();

  constructor(
    private localStorageService: LocalStorageService,
    private authService: AuthService
  ) { }


  startTest() {
    const user = this.getCurrentUser();
    if (!user) return;

    const newTest: Test = {
      id: Date.now().toString(),
      userId: user.id,
      startTime: Date.now(),
      endTime: undefined,
      sections: this.getQuestions(),
      status: 'in-progress'
    };

    this.currentTest.next(newTest);
    this.saveTest(newTest);
  }
  getLatestTest(): Test | null {
    const tests = this.localStorageService.get<Test[]>('tests') || [];
    return tests.length > 0 ? tests[tests.length - 1] : null;
  }

  private getQuestions(): Section[] {
    return JSON.parse(JSON.stringify(QUESTIONS));
  }

  private getCurrentUser() {
    return this.authService.getCurrentUser();
  }

  answerQuestion(questionId: string, answerIds: string[]) {
    const test = this.currentTest.value;
    if (!test) return;

    test.sections.forEach(section => {
      const question = section.questions.find(q => q.id === questionId);
      if (question) {
        question.userAnswers = answerIds;
        question.status = 'answered';
        if (!question.isMarkedForReview) {
          question.isMarkedForReview = false;
        }
      }
    });

    this.currentTest.next({ ...test });
    this.saveTest(test);
  }

  markForReview(questionId: string) {
    const test = this.currentTest.value;
    if (!test) return;

    test.sections.forEach(section => {
      const question = section.questions.find(q => q.id === questionId);
      if (question) {
        question.isMarkedForReview = !question.isMarkedForReview;
        if (question.status === 'not-attempted' && question.isMarkedForReview) {
          question.status = 'marked-for-review';
        } else if (question.status === 'marked-for-review' && !question.isMarkedForReview) {
          question.status = 'not-attempted';
        }
      }
    });

    this.currentTest.next({ ...test });
    this.saveTest(test);
  }

  isSectionSufficientlyCompleted(section: Section): boolean {
    const answeredCount = section.questions.filter(q => q.status === 'answered').length;
    return (answeredCount / section.questions.length) >= 0.8;
  }

  canSubmitTest(test: Test): boolean {
    if (test.sections.length < 2) return false;
    return this.isSectionSufficientlyCompleted(test.sections[0]) &&
      this.isSectionSufficientlyCompleted(test.sections[1]);
  }

  submitTest() {
    const test = this.currentTest.value;
    if (!test) return;

    const updatedTest: Test = {
      ...test,
      endTime: Date.now(),
      status: 'completed'
    };

    this.currentTest.next(updatedTest);
    this.saveTest(updatedTest);
  }

  private saveTest(test: Test) {
    const tests = this.localStorageService.get<Test[]>('tests') || [];
    const index = tests.findIndex(t => t.id === test.id);
    if (index !== -1) {
      tests[index] = test;
    } else {
      tests.push(test);
    }
    this.localStorageService.set('tests', tests);
  }

  getTestById(testId: string): Test | null {
    const tests = this.localStorageService.get<Test[]>('tests') || [];
    return tests.find(t => t.id === testId) || null;
  }
  getTotalTestsTaken(): number {
    const user = this.getCurrentUser();
    if (!user) return 0;
    const tests = this.localStorageService.get<Test[]>('tests') || [];
    return tests.filter(test => test.userId === user.id && test.status === 'completed').length;
  }

  getAverageScore(): number {
    const user = this.getCurrentUser();
    if (!user) return 0;
    const tests = this.localStorageService.get<Test[]>('tests') || [];
    const completedTests = tests.filter(test => test.userId === user.id && test.status === 'completed');
    if (completedTests.length === 0) return 0;

    const totalScore = completedTests.reduce((sum, test) => sum + this.calculateTestScore(test), 0);
    return Math.round(totalScore / completedTests.length);
  }

  getLastTestDate(): Date | null {
    const user = this.getCurrentUser();
    if (!user) return null;
    const tests = this.localStorageService.get<Test[]>('tests') || [];
    const userTests = tests.filter(test => test.userId === user.id && test.status === 'completed');
    if (userTests.length === 0) return null;

    return new Date(Math.max(...userTests.map(test => test.endTime || 0)));
  }

  private calculateTestScore(test: Test): number {
    let correctAnswers = 0;
    let totalQuestions = 0;

    test.sections.forEach(section => {
      section.questions.forEach(question => {
        totalQuestions++;
        if (this.isAnswerCorrect(question)) {
          correctAnswers++;
        }
      });
    });

    return Math.round((correctAnswers / totalQuestions) * 100);
  }

  private isAnswerCorrect(question: Question): boolean {
    return JSON.stringify(question.userAnswers.sort()) === JSON.stringify(question.correctAnswers.sort());
  }

}
