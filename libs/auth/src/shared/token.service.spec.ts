import { ApiLoggingClass } from '@dx/logger';
import { TokenService } from './token.service';
import { TEST_UUID } from '@dx/config-shared';

jest.mock('@dx/logger');

describe('TokenService', () => {
  beforeAll(() => {
    new ApiLoggingClass({ appName: 'Unit-Test' });
  });

  it('should exist', () => {
    expect(TokenService).toBeDefined();
  });

  describe('generateTokens', () => {
    it('should exist', () => {
      // arrante
      // act
      // assert
      expect(TokenService.generateTokens).toBeDefined();
    });

    it('should generate tokens when called', () => {
      // arrante
      // act
      const tokens = TokenService.generateTokens(TEST_UUID);
      // assert
      expect(tokens).toBeDefined();
      expect(tokens.accessToken).toBeDefined();
      expect(tokens.accessTokenExp).toBeDefined();
      expect(tokens.refreshToken).toBeDefined();
      expect(tokens.refreshTokenExp).toBeDefined();
    });
  });

  describe('getUserIdFromToken', () => {
    it('should exist', () => {
      // arrante
      // act
      // assert
      expect(TokenService.getUserIdFromToken).toBeDefined();
    });

    it('should get a userID from an accessToken when called', () => {
      // arrante
      // act
      const tokens = TokenService.generateTokens(TEST_UUID);
      const userId = TokenService.getUserIdFromToken(tokens.accessToken);
      // assert
      expect(userId).toBeDefined();
      expect(userId).toEqual(TEST_UUID);
    });

    it('should get a userID from a refreshToken when called', () => {
      // arrante
      // act
      const tokens = TokenService.generateTokens(TEST_UUID);
      const userId = TokenService.getUserIdFromToken(tokens.refreshToken);
      // assert
      expect(userId).toBeDefined();
      expect(userId).toEqual(TEST_UUID);
    });
  });

  describe('isRefreshValid', () => {
    it('should exist', () => {
      // arrante
      // act
      // assert
      expect(TokenService.isRefreshValid).toBeDefined();
    });

    test('should return false when refresh token is invalid', async () => {
      // arrante
      // act
      const tokens = TokenService.generateTokens(TEST_UUID);
      const userId = await TokenService.isRefreshValid(tokens.refreshToken);
      // assert
      expect(userId).toBeDefined();
      expect(userId).toBe(false);
    });
  });
});
