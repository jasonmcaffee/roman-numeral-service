import { Controller, Get, Post, Put, Delete, Param, Body, Query, UsePipes } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { RomanNumeralService } from '../services/romanNumeral.service';
import { ConvertIntegerToRomanNumeralResponse } from '../models/api/convertIntegerToRomanNumeralResponse.model';
import { convertIntegerToRomanNumeralRequestSchema } from '../schemas/api/romanNumeral.schema';
import { ZodValidationPipe } from '../pipes/zodValidation.pipe';
import { Span } from 'nestjs-ddtrace';

@ApiTags('RomanNumeral')
@Controller('')
export class RomanNumeralController {
  constructor(private readonly romanNumeralService: RomanNumeralService) {}

  @ApiOperation({ summary: 'Convert a number to a roman numeral' })
  @ApiQuery({
    name: 'query',
    type: Number,
    description: 'The integer to convert to a Roman Numeral.',
    maximum: 3999,
    minimum: 1,
  })
  @Get('romannumeral')
  @UsePipes(new ZodValidationPipe(convertIntegerToRomanNumeralRequestSchema))
  @ApiResponse({
    status: 200,
    description: 'Conversion result.',
    type: ConvertIntegerToRomanNumeralResponse,
  })
  @Span('RomanNumeralController.convertIntegerToRomanNumeral') // <--- ADD THIS
  convertIntegerToRomanNumeral(@Query() queryParams: { query: number }) {
    const response = this.romanNumeralService.convertIntegerToRomanNumeral(queryParams.query);
    return response;
  }
}
