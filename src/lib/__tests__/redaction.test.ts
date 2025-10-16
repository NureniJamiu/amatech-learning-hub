/**
 * Sensitive Data Redaction Tests
 * 
 * Tests to verify that sensitive data is properly redacted in logs
 */

import { 
  redactSensitiveData, 
  redactApiKey, 
  redactPassword, 
  redactToken 
} from '../env-validator';

describe('Sensitive Data Redaction', () => {
  describe('redactSensitiveData', () => {
    it('should redact password fields', () => {
      const data = {
        username: 'john',
        password: 'secret123',
        email: 'john@example.com',
      };

      const redacted = redactSensitiveData(data);

      expect(redacted.username).toBe('john');
      expect(redacted.password).toBe('[REDACTED]');
      expect(redacted.email).toBe('john@example.com');
    });

    it('should redact API keys', () => {
      const data = {
        apiKey: 'xai-1234567890abcdef',
        api_key: 'sk-1234567890abcdef',
        publicKey: 'pk_test_123',
      };

      const redacted = redactSensitiveData(data);

      expect(redacted.apiKey).toBe('[REDACTED]');
      expect(redacted.api_key).toBe('[REDACTED]');
      expect(redacted.publicKey).toBe('[REDACTED]');
    });

    it('should redact tokens', () => {
      const data = {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.payload.signature',
        jwt: 'some-jwt-token',
        bearer: 'Bearer token123',
      };

      const redacted = redactSensitiveData(data);

      expect(redacted.token).toBe('[REDACTED]');
      expect(redacted.jwt).toBe('[REDACTED]');
      expect(redacted.bearer).toBe('[REDACTED]');
    });

    it('should redact nested objects', () => {
      const data = {
        user: {
          name: 'John',
          credentials: {
            password: 'secret',
            apiKey: 'xai-123',
          },
        },
      };

      const redacted = redactSensitiveData(data);

      expect(redacted.user.name).toBe('John');
      expect(redacted.user.credentials.password).toBe('[REDACTED]');
      expect(redacted.user.credentials.apiKey).toBe('[REDACTED]');
    });

    it('should redact arrays', () => {
      const data = {
        users: [
          { name: 'John', password: 'secret1' },
          { name: 'Jane', password: 'secret2' },
        ],
      };

      const redacted = redactSensitiveData(data);

      expect(redacted.users[0].name).toBe('John');
      expect(redacted.users[0].password).toBe('[REDACTED]');
      expect(redacted.users[1].name).toBe('Jane');
      expect(redacted.users[1].password).toBe('[REDACTED]');
    });

    it('should redact Grok API keys in strings', () => {
      const data = {
        message: 'Using API key xai-1234567890abcdef for request',
      };

      const redacted = redactSensitiveData(data);

      expect(redacted.message).toContain('[REDACTED]');
      expect(redacted.message).not.toContain('xai-1234567890abcdef');
    });

    it('should redact OpenAI API keys in strings', () => {
      const data = {
        message: 'Using API key sk-1234567890abcdef for request',
      };

      const redacted = redactSensitiveData(data);

      expect(redacted.message).toContain('[REDACTED]');
      expect(redacted.message).not.toContain('sk-1234567890abcdef');
    });

    it('should redact Bearer tokens in strings', () => {
      const data = {
        message: 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      };

      const redacted = redactSensitiveData(data);

      expect(redacted.message).toContain('[REDACTED]');
      expect(redacted.message).not.toContain('Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');
    });

    it('should handle null and undefined', () => {
      expect(redactSensitiveData(null)).toBeNull();
      expect(redactSensitiveData(undefined)).toBeUndefined();
    });

    it('should handle primitive types', () => {
      expect(redactSensitiveData('string')).toBe('string');
      expect(redactSensitiveData(123)).toBe(123);
      expect(redactSensitiveData(true)).toBe(true);
    });
  });

  describe('redactApiKey', () => {
    it('should show first 4 and last 4 characters', () => {
      const apiKey = 'xai-1234567890abcdef';
      const redacted = redactApiKey(apiKey);

      expect(redacted).toMatch(/^xai-\*+cdef$/);
      expect(redacted).not.toContain('1234567890ab');
    });

    it('should handle short keys', () => {
      const apiKey = 'short';
      const redacted = redactApiKey(apiKey);

      expect(redacted).toBe('[REDACTED]');
    });

    it('should handle empty keys', () => {
      const redacted = redactApiKey('');

      expect(redacted).toBe('[REDACTED]');
    });
  });

  describe('redactPassword', () => {
    it('should show password length', () => {
      const password = 'mySecretPassword123';
      const redacted = redactPassword(password);

      expect(redacted).toBe('[REDACTED:19 chars]');
    });

    it('should handle empty password', () => {
      const redacted = redactPassword('');

      expect(redacted).toBe('[REDACTED]');
    });
  });

  describe('redactToken', () => {
    it('should show JWT header only', () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.payload.signature';
      const redacted = redactToken(token);

      expect(redacted).toBe('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.[REDACTED].[REDACTED]');
    });

    it('should handle non-JWT tokens', () => {
      const token = 'simple-token';
      const redacted = redactToken(token);

      expect(redacted).toBe('[REDACTED]');
    });

    it('should handle empty token', () => {
      const redacted = redactToken('');

      expect(redacted).toBe('[REDACTED]');
    });
  });
});
