import { z } from "zod";

export const testSchema = z.object({
  name: z.string().min(3, "Test name should have at least 3 characters"),
  type: z.enum(["Chapter Wise", "PYQ", "Mock Test"]),
  subject: z.string().min(1, "Subject is required"),
  topics: z.array(z.string()).min(1, "At least one topic must be selected"),
  sub_topics: z.array(z.string()).optional(),
  correct_marks: z.number().min(0, "Correct marks must be positive"),
  wrong_marks: z.number().max(0, "Wrong marks must be negative or zero"),
  unattempt_marks: z.number(),
  difficulty: z.enum(["easy", "medium", "difficult"]),
  total_time: z.number().min(1, "Duration must be positive"),
  total_questions: z.number().min(1, "Number of questions must be positive"),
  total_marks: z.number().min(1, "Total marks must be positive"),
});

export type TestSchemaType = z.infer<typeof testSchema>;
