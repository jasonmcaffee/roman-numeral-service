import { ValidationErrorDetail } from '../types/validationErrorDetail.type';

export class InputValidationError extends Error {
  constructor(public readonly errorDetails: ValidationErrorDetail[]) {
    super('Input validation failed');
    this.name = 'InputValidationError';
  }
}
