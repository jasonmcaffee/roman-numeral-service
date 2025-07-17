import { Test, TestingModule } from '@nestjs/testing';
import { Configuration, RomanNumeralApi } from '../../clients/roman-numeral-client';
import appConfig from '../../config/appConfig';
import * as runtime from '../../clients/roman-numeral-client/runtime';
import { ValidationErrorDetail } from '../../models/errors/ValidationErrorDetail';
type ValidationError = { message: string; errorDetails: ValidationErrorDetail[] };

/**
 * Integration tests which ensure our server and client work as expected.
 * The server must be up and running before running these.
 */
describe('Client Tests', () => {
  const apiConfig = new Configuration({ basePath: `http://localhost:${appConfig.getPort()}` });

  describe('Conversation', () => {
    const api = new RomanNumeralApi(apiConfig);

    it('should convert int to roman numeral', async () => {
      const { input, output } = await api.convertIntegerToRomanNumeral(123);
      expect(input).toBe('123');
    });

    it('should return a bad request error when input value is too small', async () => {
      const expectedValidationError: ValidationError = {
        message: 'Validation failed',
        errorDetails: [
          {
            path: 'query',
            message: 'Too small: expected number to be >=1',
            code: 'too_small',
          },
        ],
      };
      await ensureValidationErrorIsReturned(async () => {
        await api.convertIntegerToRomanNumeral(0);
      }, expectedValidationError);
    });

    it('should return a bad request error when input value is too big', async () => {
      const expectedValidationError: ValidationError = {
        message: 'Validation failed',
        errorDetails: [
          {
            path: 'query',
            message: 'Too big: expected number to be <=3999',
            code: 'too_big',
          },
        ],
      };
      await ensureValidationErrorIsReturned(async () => {
        await api.convertIntegerToRomanNumeral(4000);
      }, expectedValidationError);
    });

    it('should return a bad request error when input value is not a number', async () => {
      const expectedValidationError: ValidationError = {
        message: 'Validation failed',
        errorDetails: [
          {
            path: 'query',
            message: 'Invalid input: expected number, received NaN',
            code: 'invalid_type',
          },
        ],
      };
      await ensureValidationErrorIsReturned(async () => {
        const s = 'not a number' as unknown as number;
        await api.convertIntegerToRomanNumeral(s);
      }, expectedValidationError);
    });
  });
});

//helper function that ensures the service is returning a 400 with validation error details.
async function ensureValidationErrorIsReturned(func: () => Promise<void>, expectedValidationError: ValidationError) {
  try {
    await func();
    fail('Expected an error but none were thrown.');
  } catch (err: unknown) {
    if (err instanceof runtime.ResponseError) {
      expect(err.response.status).toBe(400);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const body = await err.response.json();
      expect(body).toEqual(expectedValidationError);
    } else {
      throw err;
    }
  }
}
