import { Test, TestingModule } from '@nestjs/testing';
import { Configuration, RomanNumeralApi } from '../../clients/roman-numeral-client';
import appConfig from '../../config/appConfig';
import * as runtime from '../../clients/roman-numeral-client/runtime';
import { ValidationErrorDetail } from '../../types/validationErrorDetail.type';
import { RomanNumeralService } from '../../services/romanNumeral.service';
type ValidationError = { message: string; errorDetails: ValidationErrorDetail[] };

/**
 * Unit tests to help test isolated functions that are relatively complex.
 * The server must be up and running before running these.
 */
describe('Roman Numeral Service Unit Tests', () => {
  let testingModule: TestingModule;
  //set up our dependency injection (@Injectable). Since RomanNumeralService doesn't have any dependencies, we just need to register it alone.
  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      providers: [RomanNumeralService],
    }).compile();
  });
  describe('convertIntegerToRomanNumeral endpoint', () => {
    //https://en.wikipedia.org/wiki/Roman_numerals
    it('should convert integers into place values', () => {
      const romanNumeralService = testingModule.get<RomanNumeralService>(RomanNumeralService);
      const r1 = romanNumeralService.convertNumberIntoPlaceValues(4562);
      expect(r1.thousands).toEqual(4);
      expect(r1.hundreds).toEqual(5);
      expect(r1.tens).toEqual(6);
      expect(r1.units).toEqual(2);

      const r2 = romanNumeralService.convertNumberIntoPlaceValues(2);
      expect(r2.thousands).toEqual(0);
      expect(r2.hundreds).toEqual(0);
      expect(r2.tens).toEqual(0);
      expect(r2.units).toEqual(2);
    });
  });
});
