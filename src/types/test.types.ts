export interface Test {
  id: string;

  name: string;

  subject: string;

  status: "Draft" | "Published";

  created_at: string;
}
