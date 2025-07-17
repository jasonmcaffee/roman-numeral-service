import { Injectable } from '@nestjs/common';

@Injectable()
export class RomanNumeralService {
  constructor() {}
  convertIntegerToRomanNumeral(numberToConvert: number){
    console.log(`convertIntegerToRomanNumeral called with ${numberToConvert}`);
    return '';
  }
}
