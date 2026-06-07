import { z } from "zod";

export const loginSchema = z.object({
  userId: z.string().min(1, "Username is required"),

  password: z.string().min(1, "Password is required"),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
