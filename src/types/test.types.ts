export interface Test {
  id: string;
  name: string;
  type: "Chapter Wise" | "PYQ" | "Mock Test";
  subject: string;
  topics: string[];
  sub_topics?: string[];
  correct_marks: number;
  wrong_marks: number;
  unattempt_marks: number;
  difficulty: "easy" | "medium" | "difficult";
  total_time: number;
  total_marks: number;
  total_questions: number;
  status: "draft" | "live";
  questions?: string[];
  created_at?: string;
}
