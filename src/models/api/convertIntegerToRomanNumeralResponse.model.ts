import { ApiProperty } from '@nestjs/swagger';

export class ConvertIntegerToRomanNumeralResponse {
  @ApiProperty({ description: 'original input integer provided to convert ' })
  input: string;
  @ApiProperty({ description: 'result ' })
  output: string;
}
