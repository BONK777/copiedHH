import { z } from "zod";

export const applicationSchema = z.object({
  vacancyId: z.string().cuid(),
  coverLetter: z.string().min(20)
});
