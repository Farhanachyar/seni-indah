const generateAESKey = async (): Promise<CryptoKey> => {
  return await crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256, 
    },
    true, 
    ['encrypt', 'decrypt']
  );
};

const exportKey = async (key: CryptoKey): Promise<ArrayBuffer> => {
  return await crypto.subtle.exportKey('raw', key);
};

const importKey = async (keyData: ArrayBuffer): Promise<CryptoKey> => {
  return await crypto.subtle.importKey(
    'raw',
    keyData,
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt']
  );
};

const generateIV = (): Uint8Array => {
  return crypto.getRandomValues(new Uint8Array(12));
};

const encryptData = async (data: string, key: CryptoKey): Promise<{ encryptedData: string; iv: string }> => {
  const iv = generateIV();
  const encodedData = new TextEncoder().encode(data);

  const encryptedBuffer = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv as BufferSource, // <-- Tambahkan ini
    },
    key,
    encodedData
  );

  const encryptedData = btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer)));
  const ivString = btoa(String.fromCharCode(...iv));

  return {
    encryptedData,
    iv: ivString
  };
};

const decryptData = async (encryptedData: string, iv: string, key: CryptoKey): Promise<string> => {
  const encryptedBuffer = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
  const ivBuffer = Uint8Array.from(atob(iv), c => c.charCodeAt(0));

  const decryptedBuffer = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: ivBuffer as BufferSource, // <-- Tambahkan ini
    },
    key,
    encryptedBuffer
  );

  return new TextDecoder().decode(decryptedBuffer);
};

const FIXED_ENCRYPTION_KEY = new Uint8Array([
  0x2b, 0x7e, 0x15, 0x16, 0x28, 0xae, 0xd2, 0xa6,
  0xab, 0xf7, 0x15, 0x88, 0x09, 0xcf, 0x4f, 0x3c,
  0x2b, 0x7e, 0x15, 0x16, 0x28, 0xae, 0xd2, 0xa6,
  0xab, 0xf7, 0x15, 0x88, 0x09, 0xcf, 0x4f, 0x3c
]);

let masterKey: CryptoKey | null = null;

const initializeMasterKey = async (): Promise<void> => {

  masterKey = await crypto.subtle.importKey(
    'raw',
    FIXED_ENCRYPTION_KEY,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
};

const getMasterKey = async (): Promise<CryptoKey> => {
  if (!masterKey) {
    await initializeMasterKey();
  }
  return masterKey!;
};

export const encryptPayload = async (payload: any): Promise<{ data: string; iv: string }> => {
  const key = await getMasterKey();
  const jsonString = JSON.stringify(payload);
  const result = await encryptData(jsonString, key);
  return {
    data: result.encryptedData,
    iv: result.iv
  };
};

export const decryptPayload = async (encryptedData: string, iv: string): Promise<any> => {
  const key = await getMasterKey();
  const decryptedString = await decryptData(encryptedData, iv, key);
  return JSON.parse(decryptedString);
};

initializeMasterKey();

export {
  generateAESKey,
  exportKey,
  importKey,
  generateIV,
  encryptData,
  decryptData,
  initializeMasterKey,
  getMasterKey
};