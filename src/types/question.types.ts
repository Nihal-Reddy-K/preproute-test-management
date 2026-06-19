export interface Question {
  id?: number | string;
  type: string; // e.g. "mcq"
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correct_option: "option1" | "option2" | "option3" | "option4";
  explanation?: string;
  difficulty?: string;
  topic?: string;
  subtopic?: string;
  media_url?: string;
  test_id?: string;
}
