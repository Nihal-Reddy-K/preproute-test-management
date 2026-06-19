import { create } from "zustand";
import type { Question } from "../types/question.types";
import type { Test } from "../types/test.types";
import { getTests, deleteTest as apiDeleteTest } from "../services/testService";

interface TestStore {
  tests: Test[];
  loading: boolean;
  error: string | null;
  testData: any;
  questions: Question[];

  setTestData: (data: any) => void;
  fetchTests: () => Promise<void>;
  addTest: (test: Test) => void;
  deleteTest: (id: string) => Promise<void>;
  addQuestion: (question: Question) => void;
  deleteQuestion: (id: number | string) => void;
  clearQuestions: () => void;
  setQuestions: (questions: Question[]) => void;
}

export const useTestStore = create<TestStore>((set) => ({
  tests: [],
  loading: false,
  error: null,
  testData: null,
  questions: [],

  setTestData: (data) =>
    set({
      testData: data,
    }),

  fetchTests: async () => {
    set({ loading: true, error: null });
    try {
      const response = await getTests();

      const testList = Array.isArray(response)
        ? response
        : response?.data || response?.tests || [];
      set({ tests: testList, loading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message || "Failed to fetch tests",
        loading: false,
      });
    }
  },

  addTest: (test) =>
    set((state) => ({
      tests: [...state.tests, test],
    })),

  deleteTest: async (id) => {

    try {
      await apiDeleteTest(id);
    } catch (err) {
      console.warn("API delete failed, updating local state only:", err);
    } finally {
      set((state) => ({
        tests: state.tests.filter((t) => t.id !== id),
      }));
    }
  },

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

  setQuestions: (questions) =>
    set({
      questions,
    }),
}));
