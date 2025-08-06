// src/utils/cryptoWrapper.js - JavaScript Crypto Wrapper
// Compatible dengan browser dan Cloudflare Pages

/**
 * Fixed AES-256 Key (32 bytes = 256 bits) - Same as backend
 * This matches the key used in your router.js
 */
const FIXED_ENCRYPTION_KEY = new Uint8Array([
  0x2b, 0x7e, 0x15, 0x16, 0x28, 0xae, 0xd2, 0xa6,
  0xab, 0xf7, 0x15, 0x88, 0x09, 0xcf, 0x4f, 0x3c,
  0x2b, 0x7e, 0x15, 0x16, 0x28, 0xae, 0xd2, 0xa6,
  0xab, 0xf7, 0x15, 0x88, 0x09, 0xcf, 0x4f, 0x3c
]);

class CryptoManager {
  constructor() {
    this.masterKey = null;
    this.initPromise = null;
  }

  async initializeMasterKey() {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = (async () => {
      try {
        this.masterKey = await crypto.subtle.importKey(
          'raw',
          FIXED_ENCRYPTION_KEY,
          { name: 'AES-GCM', length: 256 },
          false,
          ['encrypt', 'decrypt']
        );
        console.log('✅ Master key initialized');
        return this.masterKey;
      } catch (error) {
        console.error('❌ Failed to initialize master key:', error);
        throw error;
      }
    })();

    return this.initPromise;
  }

  async getMasterKey() {
    if (!this.masterKey) {
      await this.initializeMasterKey();
    }
    return this.masterKey;
  }

  // Generate random IV (12 bytes for GCM)
  generateIV() {
    return crypto.getRandomValues(new Uint8Array(12));
  }

  // Convert base64 to Uint8Array
  base64ToUint8Array(base64) {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  // Convert Uint8Array to base64
  uint8ArrayToBase64(uint8Array) {
    const binaryString = String.fromCharCode(...uint8Array);
    return btoa(binaryString);
  }

  // Encrypt data using AES-GCM
  async encryptData(data, key) {
    const iv = this.generateIV();
    const encodedData = new TextEncoder().encode(data);
    
    const encryptedBuffer = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      encodedData
    );
    
    // Convert to base64 for JSON transmission
    const encryptedData = this.uint8ArrayToBase64(new Uint8Array(encryptedBuffer));
    const ivString = this.uint8ArrayToBase64(iv);
    
    return {
      encryptedData,
      iv: ivString
    };
  }

  // Decrypt data using AES-GCM
  async decryptData(encryptedData, iv, key) {
    // Decode from base64
    const encryptedBuffer = this.base64ToUint8Array(encryptedData);
    const ivBuffer = this.base64ToUint8Array(iv);
    
    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: ivBuffer,
      },
      key,
      encryptedBuffer
    );
    
    return new TextDecoder().decode(decryptedBuffer);
  }

  // High-level encryption function for API payloads
  async encryptPayload(payload, sessionValue = null) {
    const key = await this.getMasterKey();
    const jsonString = JSON.stringify(payload);
    const result = await this.encryptData(jsonString, key);
    
    // Generate or use existing session value
    const xy = sessionValue || this.generateSessionValue();
    
    // Create the response object
    const responseObject = {
      data: result.encryptedData,
      iv: result.iv,
      xy: xy
    };
    
    // Encode the entire object to Base64
    const base64Response = btoa(JSON.stringify(responseObject));
    
    return base64Response;
  }

  // High-level decryption function for API requests
  async decryptPayload(base64EncodedPayload) {
    try {
      // Check if it's already a JSON object
      let payloadObject;
      if (typeof base64EncodedPayload === 'object' && base64EncodedPayload.data && base64EncodedPayload.iv) {
        payloadObject = base64EncodedPayload;
      } else if (typeof base64EncodedPayload === 'string') {
        // Try to decode Base64 to get the object
        const decodedString = atob(base64EncodedPayload);
        payloadObject = JSON.parse(decodedString);
      } else {
        throw new Error('Invalid payload format');
      }
      
      // Extract data, iv from the object
      const { data: encryptedData, iv } = payloadObject;
      
      if (!encryptedData || !iv) {
        throw new Error('Missing encrypted data or IV');
      }
      
      const key = await this.getMasterKey();
      const decryptedString = await this.decryptData(encryptedData, iv, key);
      return JSON.parse(decryptedString);
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error(`Failed to decrypt payload: ${error.message}`);
    }
  }

  // Simple version for API client - decrypt with separate data and iv
  async decryptResponse(encryptedData, iv) {
    try {
      const key = await this.getMasterKey();
      const decryptedString = await this.decryptData(encryptedData, iv, key);
      return JSON.parse(decryptedString);
    } catch (error) {
      console.error('Response decryption failed:', error);
      throw new Error(`Failed to decrypt response: ${error.message}`);
    }
  }

  // Simple version for API client - encrypt payload and return object
  async encryptRequest(payload) {
    try {
      const key = await this.getMasterKey();
      const jsonString = JSON.stringify(payload);
      const result = await this.encryptData(jsonString, key);
      
      return {
        data: result.encryptedData,
        iv: result.iv
      };
    } catch (error) {
      console.error('Request encryption failed:', error);
      throw new Error(`Failed to encrypt request: ${error.message}`);
    }
  }

  // Generate session value (untuk compatibility dengan backend)
  generateSessionValue() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const randomBytes = crypto.getRandomValues(new Uint8Array(16));
    
    return Array.from(randomBytes)
      .map(byte => chars[byte % chars.length])
      .join('');
  }

  // Generate random string
  generateRandomString(length = 32) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const randomBytes = crypto.getRandomValues(new Uint8Array(length));
    
    return Array.from(randomBytes)
      .map(byte => chars[byte % chars.length])
      .join('');
  }

  // Check if crypto is available
  isCryptoSupported() {
    return typeof crypto !== 'undefined' && 
           typeof crypto.subtle !== 'undefined' &&
           typeof crypto.getRandomValues === 'function';
  }
}

// Create singleton instance
const cryptoManager = new CryptoManager();

// Export functions for compatibility with apiClient.ts
export const encryptPayload = async (payload) => {
  return await cryptoManager.encryptRequest(payload);
};

export const decryptPayload = async (encryptedData, iv) => {
  return await cryptoManager.decryptResponse(encryptedData, iv);
};

// Export individual functions
export const encryptData = async (data, key) => {
  return await cryptoManager.encryptData(data, key);
};

export const decryptData = async (encryptedData, iv, key) => {
  return await cryptoManager.decryptData(encryptedData, iv, key);
};

export const generateRandomString = (length) => {
  return cryptoManager.generateRandomString(length);
};

export const isCryptoSupported = () => {
  return cryptoManager.isCryptoSupported();
};

// Export manager instance
export { cryptoManager };

// Default export
export default {
  encryptPayload,
  decryptPayload,
  encryptData,
  decryptData,
  generateRandomString,
  isCryptoSupported,
  cryptoManager
};