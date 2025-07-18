import { Injectable } from '@nestjs/common';
import { ConvertIntegerToRomanNumeralResponse } from '../models/api/convertIntegerToRomanNumeralResponse.model';
import { validateUsingZodSchema } from '../utils/validate.util';
import { integerToRomanNumeralSchema } from '../schemas/api/romanNumeral.schema';
import { PlaceValues } from '../types/placeValues.type';
import { TraceService, Span } from 'nestjs-ddtrace';

@Injectable()
export class RomanNumeralService {
  constructor(private readonly traceService: TraceService) {}

  /**
   * Converts an integer in range 1-3999 to a Roman numeral.
   * @param integerToConvert - number to convert to a Roman numeral.
   */
  @Span('convertIntegerToRomanNumeral')
  convertIntegerToRomanNumeral(integerToConvert: number): ConvertIntegerToRomanNumeralResponse {
    this.traceService.getActiveSpan()?.setTag('input.integer', integerToConvert);
    //this is validated at the controller already, but we can make extra sure that future use cases have appropriate validation as well.
    validateUsingZodSchema(integerToConvert, integerToRomanNumeralSchema);
    const placeValues = this.convertIntegerIntoPlaceValues(integerToConvert);
    const romanNumeral = this.convertPlaceValuesIntoRomanNumerals(placeValues);
    this.traceService.getActiveSpan()?.setTag('result.romanNumeral', romanNumeral);
    return { input: integerToConvert.toString(), output: romanNumeral };
  }
  /**
   * Split the number into separate numbers at their appropriate place values.
   * e.g. 3412 = { units: 2, tens: 1, hundreds: 4, thousands: 3 }
   * @param num - number to convert to place values.
   */
  @Span('convertIntegerIntoPlaceValues')
  convertIntegerIntoPlaceValues(num: number): PlaceValues {
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

  /**
   * Convert our PlaceValues object, which has units, tens, etc broken out, into a full Roman numeral string.
   * @param placeValues - object with units, tens, etc representation of an integer.
   */
  @Span('convertPlaceValuesIntoRomanNumerals')
  convertPlaceValuesIntoRomanNumerals(placeValues: PlaceValues) {
    const unitsRomanNumerals = this.convertUnitPlaceValueToRomanNumeral(placeValues.units);
    const tensRomanNumerals = this.convertTensPlaceValueToRomanNumeral(placeValues.tens);
    const hundredsRomanNumerals = this.convertHundredsPlaceValueToRomanNumeral(placeValues.hundreds);
    const thousandsRomanNumerals = this.convertThousandsPlaceValueToRomanNumeral(placeValues.thousands);
    return `${thousandsRomanNumerals}${hundredsRomanNumerals}${tensRomanNumerals}${unitsRomanNumerals}`;
  }
  /**
   * Convert 0-9 into "" I II III IV V VI VII VIII IX
   * @param unitsPlaceValue - the integer representing the unit place value.
   */
  private convertUnitPlaceValueToRomanNumeral(unitsPlaceValue: number) {
    const unitsRomanNumerals = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];
    return unitsRomanNumerals[unitsPlaceValue];
  }

  /**
   * Convert 0-9 into "" X XX XXX XL L LX LXX LXXX XC
   * @param tensPlaceValue - the integer representing the tens place value.
   */
  private convertTensPlaceValueToRomanNumeral(tensPlaceValue: number) {
    const tensRomanNumerals = ['', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC'];
    return tensRomanNumerals[tensPlaceValue];
  }

  /**
   * Convert 0-9 into "" C CC CCC CD D DC DCC DCCC CM
   * @param hundredsPlaceValue - the integer representing the tens place value.
   */
  private convertHundredsPlaceValueToRomanNumeral(hundredsPlaceValue: number) {
    const hundredsRomanNumerals = ['', 'C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM'];
    return hundredsRomanNumerals[hundredsPlaceValue];
  }

  /**
   * Convert 0-9 into "" C CC CCC CD D DC DCC DCCC CM
   * @param thousandsPlaceValue - the integer representing the tens place value.
   */
  private convertThousandsPlaceValueToRomanNumeral(thousandsPlaceValue: number) {
    const thousandsRomanNumerals = ['', 'M', 'MM', 'MMM'];
    return thousandsRomanNumerals[thousandsPlaceValue];
  }
}
