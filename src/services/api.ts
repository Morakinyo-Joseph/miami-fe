// import { CaptureRequest, ApiConfig } from '../types';
// import { API_CONFIG } from '../config';

// export async function uploadFingerprint(data: CaptureRequest) {
//   try {
//     const response = await fetch(`${API_CONFIG.baseUrl}/fingerprint/upload-finger`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${API_CONFIG.bearerToken}`,
//         'api-key': API_CONFIG.apiKey
//       },
//       body: JSON.stringify(data)
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     return await response.json();
//   } catch (error) {
//     console.error('Error uploading fingerprint:', error);
//     throw error;
//   }
// }



// import { CaptureRequest, ApiConfig, UploadResponse, FingerprintResponse } from '../types';
// import { API_CONFIG } from '../config';

// export async function uploadFingerprint(data: CaptureRequest) {
//   try {
//     const response = await fetch(`${API_CONFIG.baseUrl}/fingerprint/upload-finger`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${API_CONFIG.bearerToken}`,
//         'api-key': API_CONFIG.apiKey
//       },
//       body: JSON.stringify(data)
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     return await response.json() as UploadResponse;
//   } catch (error) {
//     console.error('Error uploading fingerprint:', error);
//     throw error;
//   }
// }

// export async function getFingerprintDetails(clientId: number, fingerId: number) {
//   try {
//     const response = await fetch(
//       `${API_CONFIG.baseUrl}/fingerprint/finger?client_id=${clientId}&finger_id=${fingerId}`,
//       {
//         headers: {
//           'Authorization': `Bearer ${API_CONFIG.bearerToken}`,
//           'api-key': API_CONFIG.apiKey
//         }
//       }
//     );

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     return await response.json() as FingerprintResponse;
//   } catch (error) {
//     console.error('Error fetching fingerprint details:', error);
//     throw error;
//   }
// }




import { CaptureRequest, ApiConfig, UploadResponse, FingerprintResponse, ClientRequest, ClientResponse } from '../types';
import { API_CONFIG } from '../config';

export async function createClient(data: ClientRequest): Promise<ClientResponse> {
  try {
    const response = await fetch(`${API_CONFIG.baseUrl}/fingerprint/register-client`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_CONFIG.bearerToken}`,
        'api-key': API_CONFIG.apiKey
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json() as ClientResponse;
  } catch (error) {
    console.error('Error creating client:', error);
    throw error;
  }
}

export async function uploadFingerprint(data: CaptureRequest) {
  try {
    const response = await fetch(`${API_CONFIG.baseUrl}/fingerprint/upload-finger`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_CONFIG.bearerToken}`,
        'api-key': API_CONFIG.apiKey
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json() as UploadResponse;
  } catch (error) {
    console.error('Error uploading fingerprint:', error);
    throw error;
  }
}

export async function getFingerprintDetails(clientId: number, fingerId: number) {
  try {
    const response = await fetch(
      `${API_CONFIG.baseUrl}/fingerprint/finger?client_id=${clientId}&finger_id=${fingerId}`,
      {
        headers: {
          'Authorization': `Bearer ${API_CONFIG.bearerToken}`,
          'api-key': API_CONFIG.apiKey
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json() as FingerprintResponse;
  } catch (error) {
    console.error('Error fetching fingerprint details:', error);
    throw error;
  }
}