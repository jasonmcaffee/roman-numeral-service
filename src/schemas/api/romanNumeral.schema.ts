import { z } from 'zod';

export const integerToRomanNumeralSchema = z.coerce.number().int().min(1).max(3999);

export const convertIntegerToRomanNumeralRequestSchema = z.object({
  query: integerToRomanNumeralSchema,
});
