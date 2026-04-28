import { z } from "zod";

export const vacancySchema = z.object({
  title: z.string().min(3),
  description: z.string().min(20),
  location: z.string().min(2),
  salaryFrom: z.coerce.number().int().positive().optional(),
  salaryTo: z.coerce.number().int().positive().optional()
});
