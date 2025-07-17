import { z } from 'zod';

export const ConvertIntegerToRomanNumeralRequestSchema = z.object({
  query: z.coerce.number().int().min(1).max(3999),
});
