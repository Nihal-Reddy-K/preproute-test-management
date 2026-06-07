import { z } from "zod";

export const testSchema = z.object({
  name: z.string().min(3, "Test name should have at least 3 characters"),

  subject: z.string().min(2, "Subject is required"),

  topics: z.string().min(2, "Topics are required"),

  negativeMarks: z.number(),

  duration: z.number().min(1, "Duration must be positive"),
});

export type TestSchemaType = z.infer<typeof testSchema>;
