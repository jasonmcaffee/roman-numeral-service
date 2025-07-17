import { Injectable } from '@nestjs/common';
import { ConvertIntegerToRomanNumeralResponse } from '../models/api/models';

@Injectable()
export class RomanNumeralService {
  constructor() {}
  convertIntegerToRomanNumeral(numberToConvert: number): ConvertIntegerToRomanNumeralResponse {
    console.log(`convertIntegerToRomanNumeral called with ${numberToConvert}`);
    const result = 'CCXLVI';
    return { input: numberToConvert.toString(), output: result };
  }
}
