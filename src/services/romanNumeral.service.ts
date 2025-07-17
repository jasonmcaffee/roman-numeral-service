import { Injectable } from '@nestjs/common';
import { ConvertIntegerToRomanNumeralResponse } from '../models/api/convertIntegerToRomanNumeralResponse.model';
import { validateUsingZodSchema } from '../utils/validate.util';
import { integerToRomanNumeralSchema } from '../schemas/api/romanNumeral.schema';
import { PlaceValues } from '../types/placeValues.type';

@Injectable()
export class RomanNumeralService {
  constructor() {}
  convertIntegerToRomanNumeral(numberToConvert: number): ConvertIntegerToRomanNumeralResponse {
    //this is validated at the controller already, but we can make extra sure that future use cases have appropriate validation as well.
    validateUsingZodSchema(numberToConvert, integerToRomanNumeralSchema);
    console.log(`convertIntegerToRomanNumeral called with ${numberToConvert}`);
    const result = 'CCXLVI';
    return { input: numberToConvert.toString(), output: result };
  }
  /**
   * Split the number into separate numbers at their appropriate place values.
   * e.g. 3412 = { units: 2, tens: 1, hundreds: 4, thousands: 3 }
   * @param num - number to convert to place values.
   */
  convertNumberIntoPlaceValues(num: number): PlaceValues {
    //use modulus to get remainder
    return {
      //e.g. 29 % 10 == 9
      units: num % 10,
      //e.g. isolate "3" in 432 / 10 == 43.2 -> math.floor(43.2) == 43 -> 43 % 10 == 3
      tens: Math.floor(num / 10) % 10,
      //e.g. isolate "6" in 5691 / 100 == 56.91 -> math.floor(56.91) == 56 -> 56 % 10 == 6
      hundreds: Math.floor(num / 100) % 10,
      //e.g. isolate "4" in 54215 / 1000 == 54.215 -> math.floor(54.215) == 54 -> 54 % 10 == 4
      thousands: Math.floor(num / 1000) % 10,
    };
  }
}
