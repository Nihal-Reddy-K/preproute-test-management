import { create } from "zustand";

import type { Question } from "../types/question.types";
import type { Test } from "../types/test.types";

interface TestStore {
  tests: Test[];

  testData: any;

  questions: Question[];

  setTestData: (data: any) => void;

  addTest: (test: Test) => void;

  deleteTest: (id: string) => void;

  addQuestion: (question: Question) => void;

  deleteQuestion: (id: number) => void;

  clearQuestions: () => void;
}

export const useTestStore = create<TestStore>((set) => ({
  tests: [
    {
      id: "1",
      name: "English Grammar Test",
      subject: "English",
      status: "Draft",
      created_at: "5 June",
    },
    {
      id: "2",
      name: "Physics Mock Test",
      subject: "Physics",
      status: "Published",
      created_at: "3 June",
    },
    {
      id: "3",
      name: "Math Test",
      subject: "Math",
      status: "Draft",
      created_at: "1 June",
    },
  ],

  testData: null,

  questions: [],

  setTestData: (data) =>
    set({
      testData: data,
    }),

  addTest: (test) =>
    set((state) => ({
      tests: [...state.tests, test],
    })),

  deleteTest: (id) =>
    set((state) => ({
      tests: state.tests.filter((t) => t.id !== id),
    })),

  addQuestion: (question) =>
    set((state) => ({
      questions: [...state.questions, question],
    })),

  deleteQuestion: (id) =>
    set((state) => ({
      questions: state.questions.filter((q) => q.id !== id),
    })),

  clearQuestions: () =>
    set({
      questions: [],
    }),
}));
