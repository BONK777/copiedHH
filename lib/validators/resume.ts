import { z } from "zod";

export const resumeSchema = z.object({
  title: z.string().min(3),
  summary: z.string().min(30),
  experience: z.coerce.number().int().min(0).max(50),
  skills: z.string().min(3)
});
