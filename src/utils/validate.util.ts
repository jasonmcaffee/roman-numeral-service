import { ZodType } from 'zod';
import { BadRequestException } from '@nestjs/common';
import { $ZodIssue } from 'zod/v4/core/errors';
import { ValidationErrorDetail } from '../models/api/validationErrorDetail.model';
import { InputValidationError } from '../models/errors/inputValidation.error';

export function validateUsingZodSchema<TInputType, TOutputType>(input: TInputType, schema: ZodType<TOutputType, TInputType, any>) {
  const result = schema.safeParse(input);

  if (result.success) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return result.data;
  }
  //convert zod issues into ValidationErrorDetails
  const errorDetails = result.error.issues.map(mapZodValidationIssueToErrorDetails);

  throw new InputValidationError(errorDetails);
}

export function mapZodValidationIssueToErrorDetails(issue: $ZodIssue): ValidationErrorDetail {
  return {
    path: issue.path.join('.'),
    message: issue.message,
    code: issue.code,
  };
}
