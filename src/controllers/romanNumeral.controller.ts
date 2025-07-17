import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';

import { RomanNumeralService } from '../services/romanNumeral.service';
import { ConvertIntegerToRomanNumeralResponse } from '../models/api/models';

@ApiTags('RomanNumeral')
@Controller('')
export class RomanNumeralController {
  constructor(private readonly romanNumeralService: RomanNumeralService) {}

  @ApiOperation({ summary: 'Convert a number to a roman numeral' })
  @ApiQuery({
    name: 'integerToConvert',
    type: Number,
    description: 'The integer to convert to a Roman Numeral.',
  })
  @Get('romannumeral')
  @ApiResponse({
    status: 200,
    description: 'Conversion result.',
    type: ConvertIntegerToRomanNumeralResponse,
  })
  convertIntegerToRomanNumeral(@Query('integerToConvert') integerToConvert: number) {
    console.log(`${integerToConvert}`);
    const response = this.romanNumeralService.convertIntegerToRomanNumeral(integerToConvert);
    return response;
  }
}
