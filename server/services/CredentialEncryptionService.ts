import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const SALT_LENGTH = 32;
const KEY_LENGTH = 32;
const PBKDF2_ITERATIONS = 100000;

function getEncryptionKey(): string {
  const key = process.env.CREDENTIAL_ENCRYPTION_KEY || process.env.SESSION_SECRET;
  if (!key) {
    console.warn('⚠️ No encryption key configured, using default (development only)');
    return 'default-dev-encryption-key-change-in-production';
  }
  return key;
}

function deriveKey(password: string, salt: Buffer): Buffer {
  return crypto.pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, KEY_LENGTH, 'sha256');
}

export interface EncryptedCredentials {
  encrypted: string;
  iv: string;
  authTag: string;
  salt: string;
  version: number;
}

export function encryptCredentials(credentials: Record<string, any>): EncryptedCredentials {
  const plaintext = JSON.stringify(credentials);
  const salt = crypto.randomBytes(SALT_LENGTH);
  const key = deriveKey(getEncryptionKey(), salt);
  const iv = crypto.randomBytes(IV_LENGTH);
  
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(plaintext, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  const authTag = cipher.getAuthTag();
  
  return {
    encrypted,
    iv: iv.toString('base64'),
    authTag: authTag.toString('base64'),
    salt: salt.toString('base64'),
    version: 1,
  };
}

export function decryptCredentials(encryptedData: EncryptedCredentials): Record<string, any> {
  try {
    const salt = Buffer.from(encryptedData.salt, 'base64');
    const key = deriveKey(getEncryptionKey(), salt);
    const iv = Buffer.from(encryptedData.iv, 'base64');
    const authTag = Buffer.from(encryptedData.authTag, 'base64');
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedData.encrypted, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Failed to decrypt credentials:', error);
    throw new Error('Credential decryption failed - key may have changed or data is corrupted');
  }
}

export function isEncryptedFormat(data: any): data is EncryptedCredentials {
  return data && 
    typeof data === 'object' &&
    typeof data.encrypted === 'string' &&
    typeof data.iv === 'string' &&
    typeof data.authTag === 'string' &&
    typeof data.salt === 'string' &&
    typeof data.version === 'number';
}

const DEFAULT_SENSITIVE_FIELDS = [
  'accessToken', 'access_token', 
  'refreshToken', 'refresh_token',
  'apiKey', 'api_key', 'apikey',
  'client_secret', 'clientSecret',
  'password', 'passwd', 'secret',
  'token', 'bearer', 'bearerToken',
  'privateKey', 'private_key',
  'secretKey', 'secret_key',
  'authToken', 'auth_token',
  'oauth_token', 'oauthToken',
  'credentials', 'creds'
];

function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as unknown as T;
  }
  const cloned: Record<string, any> = {};
  for (const key of Object.keys(obj as object)) {
    cloned[key] = deepClone((obj as Record<string, any>)[key]);
  }
  return cloned as T;
}

function isSensitiveKey(key: string, sensitivePatterns: string[]): boolean {
  const lowerKey = key.toLowerCase();
  return sensitivePatterns.some(pattern => {
    const lowerPattern = pattern.toLowerCase();
    return lowerKey === lowerPattern || 
           lowerKey.includes(lowerPattern) ||
           lowerKey.includes('token') ||
           lowerKey.includes('secret') ||
           lowerKey.includes('password') ||
           lowerKey.includes('key') ||
           lowerKey.includes('credential') ||
           lowerKey.includes('auth');
  });
}

function extractSensitiveFieldsRecursive(
  obj: Record<string, any>,
  sensitivePatterns: string[],
  path: string = ''
): { cleaned: Record<string, any>; sensitive: Record<string, any> } {
  const cleaned: Record<string, any> = {};
  const sensitive: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const fullPath = path ? `${path}.${key}` : key;
    
    if (value === null || value === undefined) {
      cleaned[key] = value;
      continue;
    }
    
    if (Array.isArray(value)) {
      const cleanedArray: any[] = [];
      const sensitiveArray: any[] = [];
      let hasSensitive = false;
      
      for (let i = 0; i < value.length; i++) {
        const item = value[i];
        if (typeof item === 'object' && item !== null) {
          const nested = extractSensitiveFieldsRecursive(item, sensitivePatterns, `${fullPath}[${i}]`);
          cleanedArray.push(nested.cleaned);
          if (Object.keys(nested.sensitive).length > 0) {
            sensitiveArray.push(nested.sensitive);
            hasSensitive = true;
          } else {
            sensitiveArray.push(null);
          }
        } else if (typeof item === 'string' && isSensitiveKey(key, sensitivePatterns)) {
          sensitiveArray.push(item);
          cleanedArray.push(null);
          hasSensitive = true;
        } else {
          cleanedArray.push(item);
          sensitiveArray.push(null);
        }
      }
      
      cleaned[key] = cleanedArray;
      if (hasSensitive) {
        sensitive[key] = sensitiveArray;
      }
    } else if (typeof value === 'object') {
      const nested = extractSensitiveFieldsRecursive(value, sensitivePatterns, fullPath);
      if (Object.keys(nested.sensitive).length > 0) {
        sensitive[key] = nested.sensitive;
      }
      if (Object.keys(nested.cleaned).length > 0) {
        cleaned[key] = nested.cleaned;
      }
    } else if (isSensitiveKey(key, sensitivePatterns) && typeof value === 'string' && value.length > 0) {
      sensitive[key] = value;
    } else {
      cleaned[key] = value;
    }
  }
  
  return { cleaned, sensitive };
}

function mergeSensitiveFields(
  base: Record<string, any>,
  sensitive: Record<string, any>
): Record<string, any> {
  const result = deepClone(base);
  
  for (const [key, value] of Object.entries(sensitive)) {
    if (Array.isArray(value)) {
      if (Array.isArray(result[key])) {
        for (let i = 0; i < value.length; i++) {
          if (value[i] !== null) {
            if (typeof value[i] === 'object' && typeof result[key][i] === 'object') {
              result[key][i] = mergeSensitiveFields(result[key][i] || {}, value[i]);
            } else {
              result[key][i] = value[i];
            }
          }
        }
      }
    } else if (typeof value === 'object' && value !== null) {
      if (typeof result[key] === 'object' && result[key] !== null) {
        result[key] = mergeSensitiveFields(result[key], value);
      } else {
        result[key] = value;
      }
    } else {
      result[key] = value;
    }
  }
  
  return result;
}

export function encryptSensitiveFields(
  config: Record<string, any>,
  sensitiveFields: string[] = DEFAULT_SENSITIVE_FIELDS
): Record<string, any> {
  if (!config || typeof config !== 'object') {
    return config;
  }
  
  const { cleaned, sensitive } = extractSensitiveFieldsRecursive(config, sensitiveFields);
  
  if (Object.keys(sensitive).length > 0) {
    cleaned._encrypted = encryptCredentials(sensitive);
  }
  
  return cleaned;
}

export function decryptSensitiveFields(config: Record<string, any>): Record<string, any> {
  if (!config || typeof config !== 'object') {
    return config;
  }
  
  const result = deepClone(config);
  
  if (!result._encrypted) {
    return result;
  }
  
  try {
    const decryptedSensitive = decryptCredentials(result._encrypted);
    delete result._encrypted;
    return mergeSensitiveFields(result, decryptedSensitive);
  } catch (error) {
    console.error('Failed to decrypt sensitive fields:', error);
    delete result._encrypted;
    return result;
  }
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

export class CredentialEncryptionService {
  private static instance: CredentialEncryptionService;
  
  static getInstance(): CredentialEncryptionService {
    if (!CredentialEncryptionService.instance) {
      CredentialEncryptionService.instance = new CredentialEncryptionService();
    }
    return CredentialEncryptionService.instance;
  }
  
  encryptIntegrationConfig(config: Record<string, any>): Record<string, any> {
    return encryptSensitiveFields(config);
  }
  
  decryptIntegrationConfig(config: Record<string, any>): Record<string, any> {
    return decryptSensitiveFields(config);
  }
  
  rotateCredentials(
    oldEncrypted: EncryptedCredentials,
    newKey?: string
  ): EncryptedCredentials {
    const decrypted = decryptCredentials(oldEncrypted);
    return encryptCredentials(decrypted);
  }
}

export const credentialEncryption = CredentialEncryptionService.getInstance();
