import { Test, TestingModule } from '@nestjs/testing';
import { RomanNumeralService } from '../../services/romanNumeral.service';
import { PlaceValues } from '../../models/types/placeValues.type';
import { TraceService } from 'nestjs-ddtrace';

/**
 * Unit tests to help test isolated functions that are relatively complex.
 * The server must be up and running before running these.
 */
describe('Roman Numeral Service Unit Tests', () => {
  let testingModule: TestingModule;
  const mockTraceService = {
    getActiveSpan: jest.fn().mockReturnValue({
      setTag: jest.fn(),
    }),
  };
  //set up our dependency injection (@Injectable). Since RomanNumeralService doesn't have any dependencies, we just need to register it alone.
  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        RomanNumeralService,
        {
          provide: TraceService,
          useValue: mockTraceService,
        },
      ],
    }).compile();
  });
  describe('roman numeral service', () => {
    it('should convert integers into place values', () => {
      const romanNumeralService = testingModule.get<RomanNumeralService>(RomanNumeralService);
      const r1 = romanNumeralService.convertIntegerIntoPlaceValues(4562);
      expect(r1.thousands).toEqual(4);
      expect(r1.hundreds).toEqual(5);
      expect(r1.tens).toEqual(6);
      expect(r1.units).toEqual(2);

      const r2 = romanNumeralService.convertIntegerIntoPlaceValues(2);
      expect(r2.thousands).toEqual(0);
      expect(r2.hundreds).toEqual(0);
      expect(r2.tens).toEqual(0);
      expect(r2.units).toEqual(2);
    });

    it('should convert place values into roman numerals', () => {
      const romanNumeralService = testingModule.get<RomanNumeralService>(RomanNumeralService);

      const result1 = romanNumeralService.convertPlaceValuesIntoRomanNumerals({
        units: 1,
        tens: 2,
        hundreds: 3,
        thousands: 2,
      });
      expect(result1).toEqual('MMCCCXXI');

      const result2 = romanNumeralService.convertPlaceValuesIntoRomanNumerals({
        units: 5,
        tens: 0,
        hundreds: 4,
        thousands: 0,
      });
      expect(result2).toEqual('CDV');
    });

    it('should convert integers into roman numerals', () => {
      const romanNumeralService = testingModule.get<RomanNumeralService>(RomanNumeralService);
      const result1 = romanNumeralService.convertIntegerToRomanNumeral(39);
      expect(result1.output).toEqual('XXXIX');

      const result2 = romanNumeralService.convertIntegerToRomanNumeral(4);
      expect(result2.output).toEqual('IV'); // Subtractive notation

      const result3 = romanNumeralService.convertIntegerToRomanNumeral(9);
      expect(result3.output).toEqual('IX'); // Subtractive notation

      const result4 = romanNumeralService.convertIntegerToRomanNumeral(40);
      expect(result4.output).toEqual('XL'); // Subtractive with L

      const result5 = romanNumeralService.convertIntegerToRomanNumeral(44);
      expect(result5.output).toEqual('XLIV'); // Mix of subtractives

      const result6 = romanNumeralService.convertIntegerToRomanNumeral(99);
      expect(result6.output).toEqual('XCIX'); // Compound subtractive

      const result7 = romanNumeralService.convertIntegerToRomanNumeral(400);
      expect(result7.output).toEqual('CD'); // Subtractive notation for 500

      const result8 = romanNumeralService.convertIntegerToRomanNumeral(944);
      expect(result8.output).toEqual('CMXLIV'); // Multi subtractives in 1000s

      const result9 = romanNumeralService.convertIntegerToRomanNumeral(1987);
      expect(result9.output).toEqual('MCMLXXXVII'); // Complex number

      const result10 = romanNumeralService.convertIntegerToRomanNumeral(3999);
      expect(result10.output).toEqual('MMMCMXCIX'); // Upper limit
    });
  });
});
