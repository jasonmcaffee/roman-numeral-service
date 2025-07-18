import { ApiProperty } from '@nestjs/swagger';

/**
 * Allows us to provide more context as to why an error occurred.
 */
export class ValidationErrorDetail {
  @ApiProperty({ description: 'path where the error occurred' })
  path: string;
  @ApiProperty({ description: 'error message' })
  message: string;
  @ApiProperty({ description: 'error code' })
  code: string;
}
