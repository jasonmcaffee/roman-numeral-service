import { Test, TestingModule } from '@nestjs/testing';
import { Configuration, RomanNumeralApi } from '../../clients/roman-numeral-client';
import appConfig from '../../config/appConfig';

describe('Client Tests', () => {
  const apiConfig = new Configuration({ basePath: `http://localhost:${appConfig.getPort()}` });

  describe('Conversation', () => {
    const api = new RomanNumeralApi(apiConfig);

    it('should convert int to roman numeral', async () => {
      const { input, output } = await api.convertIntegerToRomanNumeral(123);
      expect(input).toBe('123');
    });
  });
});
