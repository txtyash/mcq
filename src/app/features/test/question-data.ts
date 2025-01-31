import { Section } from "../../shared/models";

export const QUESTIONS: Section[] = [
  {
    id: "1",
    name: "JavaScript Basics",
    questions: [
      {
        id: "1_q1",
        text: "Which of the following is NOT a primitive data type in JavaScript?",
        type: "single",
        options: [
          { id: "1_q1a", text: "Number" },
          { id: "1_q1b", text: "String" },
          { id: "1_q1c", text: "Boolean" },
          { id: "1_q1d", text: "Object" }
        ],
        correctAnswers: ["1_q1d"],
        userAnswers: [],
        status: "not-attempted",
        isMarkedForReview: false
      },
      {
        id: "1_q2",
        text: "Which of the following are valid ways to declare a variable in JavaScript?",
        type: "multiple",
        options: [
          { id: "1_q2a", text: "var" },
          { id: "1_q2b", text: "let" },
          { id: "1_q2c", text: "const" },
          { id: "1_q2d", text: "variable" }
        ],
        correctAnswers: ["1_q2a", "1_q2b", "1_q2c"],
        userAnswers: [],
        status: "not-attempted",
        isMarkedForReview: false
      },
      {
        id: "1_q3",
        text: "What is the output of console.log(typeof NaN)?",
        type: "single",
        options: [
          { id: "1_q3a", text: "\"number\"" },
          { id: "1_q3b", text: "\"NaN\"" },
          { id: "1_q3c", text: "\"undefined\"" },
          { id: "1_q3d", text: "\"object\"" }
        ],
        correctAnswers: ["1_q3a"],
        userAnswers: [],
        status: "not-attempted",
        isMarkedForReview: false
      },
      {
        id: "1_q4",
        text: "Which of the following is NOT a valid way to create a function in JavaScript?",
        type: "single",
        options: [
          { id: "1_q4a", text: "function myFunc() {}" },
          { id: "1_q4b", text: "const myFunc = function() {}" },
          { id: "1_q4c", text: "const myFunc = () => {}" },
          { id: "1_q4d", text: "function = myFunc() {}" }
        ],
        correctAnswers: ["1_q4d"],
        userAnswers: [],
        status: "not-attempted",
        isMarkedForReview: false
      },
      {
        id: "1_q5",
        text: "What is the result of '5' + 3 in JavaScript?",
        type: "single",
        options: [
          { id: "1_q5a", text: "8" },
          { id: "1_q5b", text: "53" },
          { id: "1_q5c", text: "NaN" },
          { id: "1_q5d", text: "Error" }
        ],
        correctAnswers: ["1_q5b"],
        userAnswers: [],
        status: "not-attempted",
        isMarkedForReview: false
      }
    ]
  },
  {
    id: "2",
    name: "JavaScript Advanced",
    questions: [
      {
        id: "2_q1",
        text: "Which of the following are true about closures in JavaScript?",
        type: "multiple",
        options: [
          { id: "2_q1a", text: "They have access to variables in their outer scope" },
          { id: "2_q1b", text: "They can only be created using arrow functions" },
          { id: "2_q1c", text: "They help in data privacy" },
          { id: "2_q1d", text: "They always return a value" }
        ],
        correctAnswers: ["2_q1a", "2_q1c"],
        userAnswers: [],
        status: "not-attempted",
        isMarkedForReview: false
      },
      {
        id: "2_q2",
        text: "What is the output of console.log(1 + '2' + 3)?",
        type: "single",
        options: [
          { id: "2_q2a", text: "\"123\"" },
          { id: "2_q2b", text: "6" },
          { id: "2_q2c", text: "\"15\"" },
          { id: "2_q2d", text: "Error" }
        ],
        correctAnswers: ["2_q2a"],
        userAnswers: [],
        status: "not-attempted",
        isMarkedForReview: false
      },
      {
        id: "2_q3",
        text: "Which of the following are true about the 'this' keyword in JavaScript?",
        type: "multiple",
        options: [
          { id: "2_q3a", text: "It always refers to the global object" },
          { id: "2_q3b", text: "Its value can be changed using call(), apply(), or bind()" },
          { id: "2_q3c", text: "Arrow functions have their own 'this' binding" },
          { id: "2_q3d", text: "It refers to the object that is executing the current function" }
        ],
        correctAnswers: ["2_q3b", "2_q3d"],
        userAnswers: [],
        status: "not-attempted",
        isMarkedForReview: false
      },
      {
        id: "2_q4",
        text: "What is the purpose of the 'use strict' directive in JavaScript?",
        type: "single",
        options: [
          { id: "2_q4a", text: "To enable new ECMAScript features" },
          { id: "2_q4b", text: "To enforce stricter parsing and error handling" },
          { id: "2_q4c", text: "To improve performance" },
          { id: "2_q4d", text: "To disable certain JavaScript features" }
        ],
        correctAnswers: ["2_q4b"],
        userAnswers: [],
        status: "not-attempted",
        isMarkedForReview: false
      },
      {
        id: "2_q5",
        text: "Which of the following are true about Promises in JavaScript?",
        type: "multiple",
        options: [
          { id: "2_q5a", text: "They are used for handling asynchronous operations" },
          { id: "2_q5b", text: "They always resolve successfully" },
          { id: "2_q5c", text: "They can be chained using .then()" },
          { id: "2_q5d", text: "They can only handle one asynchronous operation at a time" }
        ],
        correctAnswers: ["2_q5a", "2_q5c"],
        userAnswers: [],
        status: "not-attempted",
        isMarkedForReview: false
      }
    ]
  }
];
