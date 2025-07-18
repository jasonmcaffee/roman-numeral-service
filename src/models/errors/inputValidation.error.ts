import { ValidationErrorDetail } from '../api/validationErrorDetail.model';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Provide details to the client around the type of error that occurred.
 */
export class InputValidationError extends Error {
  @ApiProperty({ description: 'Collection of further details.', type: ValidationErrorDetail })
  public readonly errorDetails: ValidationErrorDetail[];
  constructor(errorDetails: ValidationErrorDetail[]) {
    super('Input validation failed');
    this.errorDetails = errorDetails;
    this.name = 'InputValidationError';
  }
}
