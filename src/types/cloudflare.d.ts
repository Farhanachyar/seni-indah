declare global {
  interface CloudflareEnv {

    DB: D1Database;

    STORAGE: R2Bucket;

    KV: KVNamespace;

    ENVIRONMENT?: string;
    API_BASE_URL?: string;
  }

  namespace NodeJS {
    interface ProcessEnv extends CloudflareEnv {
      NODE_ENV: 'development' | 'production' | 'test';
    }
  }

  interface KVGetOptions {
    type?: 'text' | 'json' | 'arrayBuffer' | 'stream';
    cacheTtl?: number;
  }

  interface KVPutOptions {
    expiration?: number;
    expirationTtl?: number;
    metadata?: Record<string, any>;
  }

  interface KVListOptions {
    limit?: number;
    prefix?: string;
    cursor?: string;
  }

  interface KVListResult {
    keys: KVKey[];
    list_complete: boolean;
    cursor?: string;
  }

  interface KVKey {
    name: string;
    expiration?: number;
    metadata?: Record<string, any>;
  }

  interface R2PutOptions {
    httpMetadata?: R2HTTPMetadata;
    customMetadata?: Record<string, string>;
    md5?: ArrayBuffer | string;
    sha1?: ArrayBuffer | string;
    sha256?: ArrayBuffer | string;
    sha384?: ArrayBuffer | string;
    sha512?: ArrayBuffer | string;
  }

  interface R2HTTPMetadata {
    contentType?: string;
    contentLanguage?: string;
    contentDisposition?: string;
    contentEncoding?: string;
    cacheControl?: string;
    cacheExpiry?: Date;
    expires?: Date;
  }

  interface R2ListOptions {
    limit?: number;
    prefix?: string;
    cursor?: string;
    delimiter?: string;
    startAfter?: string;
    include?: ('httpMetadata' | 'customMetadata')[];
  }
}

export {};