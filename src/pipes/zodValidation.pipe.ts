import { PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ZodType } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodType<any, any, any>) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    const result = this.schema.safeParse(value);

    if (result.success) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return result.data;
    }

    // Gather error details safely from ZodError's 'issues' array, so the client gets specific messages like:
    // "Number must be less than or equal to 3999" for exceeding max
    const errors = result.error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
      code: issue.code,
    }));

    throw new BadRequestException({
      message: 'Validation failed',
      errors,
    });
  }
}
