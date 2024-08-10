export interface User {
  id: string;
  name: string;
  email: string;
}

export interface UserWithPassword extends User {
  password: string;
}

export interface AppState {
  loggedIn: boolean;
  user: User | null;
}

export interface Test {
  id: string;
  userId: string;
  startTime: number;
  endTime?: number;
  sections: Section[];
  status: 'in-progress' | 'completed';
}

export interface Section {
  id: string;
  name: string;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  options: Option[];
  correctAnswers: string[];
  userAnswers: string[];
  status: 'not-attempted' | 'answered' | 'marked-for-review';
  type: 'single' | 'multiple';
  isMarkedForReview: boolean;
}

export interface Option {
  id: string;
  text: string;
  checked?: boolean;
}
