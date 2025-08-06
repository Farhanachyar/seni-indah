import { encryptPayload, decryptPayload } from './cryptoWrapper.js';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8787';

const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
};

const storeSessionValue = (sessionValue) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('session_value', sessionValue);
  }
};

const getSessionValue = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('session_value');
  }
  return null;
};

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

const apiRequest = async (options) => {
  const {
    endpoint,
    method = 'POST',
    headers = {},
    body,
    encrypted = true,
    formData = false
  } = options;

  try {

    const url = `${API_BASE_URL}${endpoint}`;

    const requestHeaders = {
      ...headers
    };

    const token = getAuthToken();
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }

    if (encrypted && !formData) {
      requestHeaders['Accept-Encryption'] = 'aes-gcm';
    }

    let requestBody = null;

    if (body) {
      if (formData) {

        requestBody = body;
      } else if (encrypted) {

        const encryptedPayload = await encryptPayload(body);

        const storedSessionValue = getSessionValue();

        const requestObject = {
          data: encryptedPayload.data,
          iv: encryptedPayload.iv
        };

        if (storedSessionValue) {
          requestObject.sv = storedSessionValue;
        }

        const base64Request = btoa(JSON.stringify(requestObject));

        requestBody = base64Request;
        requestHeaders['Content-Type'] = 'application/json';
      } else {

        requestBody = JSON.stringify(body);
        requestHeaders['Content-Type'] = 'application/json';
      }
    }

    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: requestBody,
    });

    let responseData = null;

    try {
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        const responseText = await response.text();

        if (responseText.trim()) {
          try {
            const jsonResponse = JSON.parse(responseText);

            if (jsonResponse.status && jsonResponse.detail) {

              if (jsonResponse.status === 'ERROR') {

                console.log('Backend returned error status');

                try {
                  const decodedDetail = atob(jsonResponse.detail);
                  const errorObject = JSON.parse(decodedDetail);

                  if (errorObject.data && errorObject.iv) {

                    const decryptedError = await decryptPayload(errorObject.data, errorObject.iv);
                    responseData = decryptedError;
                  } else {

                    responseData = errorObject;
                  }
                } catch (decodeError) {

                  responseData = { message: jsonResponse.detail };
                }

                throw new ApiError(
                  responseData.message || 'Server returned error',
                  response.status,
                  responseData
                );
              } else {

                console.log('Encrypted response detected, decrypting...');

                try {

                  const decodedDetail = atob(jsonResponse.detail);
                  const encryptedObject = JSON.parse(decodedDetail);

                  if (encryptedObject.data && encryptedObject.iv) {

                    responseData = await decryptPayload(encryptedObject.data, encryptedObject.iv);

                    if (encryptedObject.xy) {
                      storeSessionValue(encryptedObject.xy);
                    }

                    console.log('Successfully decrypted response:', responseData);
                  } else {
                    throw new Error('Invalid encrypted object structure');
                  }
                } catch (decryptError) {
                  console.error('Failed to decrypt response:', decryptError);
                  throw new ApiError('Failed to decrypt response', response.status, decryptError);
                }
              }
            } else {

              responseData = jsonResponse;
            }
          } catch (parseError) {
            console.error('Failed to parse response as JSON:', parseError);
            responseData = responseText;
          }
        } else {
          responseData = null;
        }
      } else {

        responseData = await response.text();
      }
    } catch (readError) {
      console.error('Failed to read response:', readError);
      throw new ApiError(`Failed to read response: ${readError.message}`, response.status);
    }

    if (!response.ok) {
      console.log('Response not OK, status:', response.status);
      console.log('Decrypted error data:', responseData);

      throw new ApiError(
        `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        responseData
      );
    }

    return responseData;

  } catch (error) {

    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error) {
      throw new ApiError(error.message, 0, error);
    }

    throw new ApiError('Unknown error occurred', 0, error);
  }
};

export const apiGet = (endpoint, headers, encrypted = false) => {
  return apiRequest({
    endpoint,
    method: 'GET',
    headers,
    encrypted
  });
};

export const apiPost = (endpoint, body, headers, encrypted = true) => {
  return apiRequest({
    endpoint,
    method: 'POST',
    body,
    headers,
    encrypted
  });
};

export const apiPut = (endpoint, body, headers, encrypted = true) => {
  return apiRequest({
    endpoint,
    method: 'PUT',
    body,
    headers,
    encrypted
  });
};

export const apiDelete = (endpoint, body, headers, encrypted = true) => {
  return apiRequest({
    endpoint,
    method: 'DELETE',
    body,
    headers,
    encrypted
  });
};

export const apiFormData = (endpoint, formData, headers) => {
  return apiRequest({
    endpoint,
    method: 'POST',
    body: formData,
    headers,
    encrypted: false,
    formData: true
  });
};

export { ApiError, apiRequest };

export { encryptPayload, decryptPayload } from './cryptoWrapper.js';

export default { apiPost, apiGet, apiPut, apiDelete, apiFormData, ApiError };