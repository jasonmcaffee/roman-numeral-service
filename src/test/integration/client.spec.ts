import { Test, TestingModule } from '@nestjs/testing';
import { Configuration, RomanNumeralApi } from '../../clients/roman-numeral-client';
import appConfig from '../../config/appConfig';
import * as runtime from '../../clients/roman-numeral-client/runtime';
import { ValidationErrorDetail } from '../../models/api/validationErrorDetail.model';
type ValidationError = { message: string; errorDetails: ValidationErrorDetail[] };

/**
 * Integration tests which ensure our server and client work as expected.
 * The server must be up and running before running these.
 */
describe('Roman Numeral Service Integration Tests', () => {
  const apiConfig = new Configuration({ basePath: `http://localhost:${appConfig.getPort()}` });
  const api = new RomanNumeralApi(apiConfig);
  describe('convertIntegerToRomanNumeral endpoint', () => {
    //https://en.wikipedia.org/wiki/Roman_numerals
    it('should convert integers to roman numeral numerals', async () => {
      //IV XL CD M
      //A number containing two or more decimal digits is built by appending the Roman numeral equivalent for each, from highest to lowest, as in the following examples:
      const { input: input1, output: output1 } = await api.convertIntegerToRomanNumeral(39);
      expect(input1).toBe('39');
      expect(output1).toBe('XXXIX');

      const { input: input2, output: output2 } = await api.convertIntegerToRomanNumeral(246);
      expect(input2).toBe('246');
      expect(output2).toBe('CCXLVI');

      const { input: input3, output: output3 } = await api.convertIntegerToRomanNumeral(789);
      expect(input3).toBe('789');
      expect(output3).toBe('DCCLXXXIX');

      //Any missing place (represented by a zero in the place-value equivalent) is omitted, as in Latin (and English) speech:
      const { input: input4, output: output4 } = await api.convertIntegerToRomanNumeral(160);
      expect(input4).toBe('160');
      expect(output4).toBe('CLX');

      const { input: input5, output: output5 } = await api.convertIntegerToRomanNumeral(207);
      expect(input5).toBe('207');
      expect(output5).toBe('CCVII');

      const { input: input6, output: output6 } = await api.convertIntegerToRomanNumeral(1009);
      expect(input6).toBe('1009');
      expect(output6).toBe('MIX');

      const { input: input7, output: output7 } = await api.convertIntegerToRomanNumeral(1066);
      expect(input7).toBe('1066');
      expect(output7).toBe('MLXVI');

      const { input: input8, output: output8 } = await api.convertIntegerToRomanNumeral(1776);
      expect(input8).toBe('1776');
      expect(output8).toBe('MDCCLXXVI');

      const { input: input9, output: output9 } = await api.convertIntegerToRomanNumeral(1918);
      expect(input9).toBe('1918');
      expect(output9).toBe('MCMXVIII');

      const { input: input10, output: output10 } = await api.convertIntegerToRomanNumeral(1944);
      expect(input10).toBe('1944');
      expect(output10).toBe('MCMXLIV');

      const { input: input11, output: output11 } = await api.convertIntegerToRomanNumeral(2025);
      expect(input11).toBe('2025');
      expect(output11).toBe('MMXXV');
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
