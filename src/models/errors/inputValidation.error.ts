import { ValidationErrorDetail } from './ValidationErrorDetail';

export class InputValidationError extends Error {
  constructor(public readonly errorDetails: ValidationErrorDetail[]) {
    super('Input validation failed');
    this.name = 'InputValidationError';
  }
}
