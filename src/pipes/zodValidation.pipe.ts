import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ZodType } from 'zod';
import { validateUsingZodSchema } from '../utils/validate.util';
import { InputValidationError } from '../models/errors/inputValidation.error';

/**
 * Pipeline which allows us to wire up our controllers to zod schema validation.
 */
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodType<any, any, any>) {}

  /**
   * Wire up controller request pipeline to our input validation mechanism.
   * @param value - request input value to be validated.
   */
  transform(value: unknown) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return validateUsingZodSchema(value, this.schema);
    } catch (e) {
      if (e instanceof InputValidationError) {
        throw new BadRequestException({
          message: 'Validation failed',
          errorDetails: e.errorDetails,
        });
      }
      throw e;
    }
  }
}
