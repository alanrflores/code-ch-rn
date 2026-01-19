/**
 * Token Manager Tests
 * Unit tests for JWT token handling utilities
 */

import {
  decodeToken,
  isTokenExpired,
  shouldRefreshToken,
  getTokenRemainingTime,
} from '../src/utils/tokenManager';

// Sample JWT token structure (not a real token, just for testing)
// Header: {"alg":"HS256","typ":"JWT"}
// Payload will be created dynamically for each test

/**
 * Creates a mock JWT token with the given payload
 * Note: This is NOT a valid JWT (signature is fake), but it works for decode testing
 */
const createMockToken = (payload) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const encodedPayload = btoa(JSON.stringify(payload));
  const signature = 'fake_signature';
  return `${header}.${encodedPayload}.${signature}`;
};

describe('decodeToken', () => {
  it('decodes a valid JWT token payload', () => {
    const payload = {
      sub: 'ToolboxMobileTest',
      name: 'Test User',
      expireDate: '2025-01-01T00:00:00.000Z',
    };
    const token = createMockToken(payload);

    const decoded = decodeToken(token);

    expect(decoded).toEqual(payload);
    expect(decoded.sub).toBe('ToolboxMobileTest');
  });

  it('returns null for invalid token format', () => {
    expect(decodeToken('invalid')).toBeNull();
    expect(decodeToken('only.two')).toBeNull();
    expect(decodeToken('')).toBeNull();
    expect(decodeToken(null)).toBeNull();
    expect(decodeToken(undefined)).toBeNull();
  });

  it('returns null for malformed payload', () => {
    const token = 'header.notvalidbase64!@#$.signature';
    expect(decodeToken(token)).toBeNull();
  });
});

describe('isTokenExpired', () => {
  it('returns true for expired token', () => {
    const payload = {
      sub: 'test',
      expireDate: '2020-01-01T00:00:00.000Z', // Past date
    };
    const token = createMockToken(payload);

    expect(isTokenExpired(token)).toBe(true);
  });

  it('returns false for valid token', () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1); // 1 year from now

    const payload = {
      sub: 'test',
      expireDate: futureDate.toISOString(),
    };
    const token = createMockToken(payload);

    expect(isTokenExpired(token)).toBe(false);
  });

  it('returns true for token without expireDate', () => {
    const payload = { sub: 'test' };
    const token = createMockToken(payload);

    expect(isTokenExpired(token)).toBe(true);
  });

  it('returns true for invalid token', () => {
    expect(isTokenExpired('invalid')).toBe(true);
    expect(isTokenExpired(null)).toBe(true);
  });
});

describe('shouldRefreshToken', () => {
  it('returns true when token is about to expire', () => {
    const almostExpired = new Date();
    almostExpired.setSeconds(almostExpired.getSeconds() + 10); // 10 seconds from now

    const payload = {
      sub: 'test',
      expireDate: almostExpired.toISOString(),
    };
    const token = createMockToken(payload);

    // Should refresh because it's within the buffer (30 seconds)
    expect(shouldRefreshToken(token)).toBe(true);
  });

  it('returns false when token has plenty of time', () => {
    const farFuture = new Date();
    farFuture.setHours(farFuture.getHours() + 1); // 1 hour from now

    const payload = {
      sub: 'test',
      expireDate: farFuture.toISOString(),
    };
    const token = createMockToken(payload);

    expect(shouldRefreshToken(token)).toBe(false);
  });

  it('returns true for already expired token', () => {
    const payload = {
      sub: 'test',
      expireDate: '2020-01-01T00:00:00.000Z',
    };
    const token = createMockToken(payload);

    expect(shouldRefreshToken(token)).toBe(true);
  });
});

describe('getTokenRemainingTime', () => {
  it('returns positive milliseconds for valid token', () => {
    const futureDate = new Date();
    futureDate.setMinutes(futureDate.getMinutes() + 5); // 5 minutes from now

    const payload = {
      sub: 'test',
      expireDate: futureDate.toISOString(),
    };
    const token = createMockToken(payload);

    const remaining = getTokenRemainingTime(token);

    // Should be approximately 5 minutes (300000ms), allow some variance
    expect(remaining).toBeGreaterThan(290000);
    expect(remaining).toBeLessThan(310000);
  });

  it('returns 0 for expired token', () => {
    const payload = {
      sub: 'test',
      expireDate: '2020-01-01T00:00:00.000Z',
    };
    const token = createMockToken(payload);

    expect(getTokenRemainingTime(token)).toBe(0);
  });

  it('returns 0 for invalid token', () => {
    expect(getTokenRemainingTime('invalid')).toBe(0);
    expect(getTokenRemainingTime(null)).toBe(0);
  });
});
