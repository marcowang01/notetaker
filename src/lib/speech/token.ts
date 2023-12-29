'use server'

import Cookie from 'universal-cookie';
import axios from 'axios';

/**
 * Asynchronously retrieves an authentication token for the speech service.
 *
 * It uses environment variables for the speech key and region,
 * then makes a POST request to the Azure token issuing endpoint.
 *
 * @returns A promise that resolves to an object containing the token and region.
 *          In case of an error, it returns an object with the token set to null and the error details.
 */
async function getSpeechToken(): Promise<{ token: string | null, region: string | undefined, error?: any }> {
  const speechKey = process.env.AZURE_SPEECH_KEY;
  const speechRegion = process.env.AZURE_SPEECH_REGION;

  const headers = { 
    headers: {
      'Ocp-Apim-Subscription-Key': speechKey,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };

  try {
    const tokenResponse = await axios.post(`https://${speechRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken`, null, headers);
    return({ token: tokenResponse.data, region: speechRegion});
  } catch (err: any) {
    return({ token: null, region: undefined, error: err.response });
  }
}




/**
 * Checks for an existing speech token in cookies. If not found,
 * it calls `getSpeechToken` to fetch a new token from the backend.
 *
 * The new token is then stored in cookies with a max age of 540 seconds.
 *
 * @returns A promise that resolves to an object containing the authToken and region.
 *          In case of an error, it returns an object with the authToken set to null and the error details.
 */
export async function getTokenOrRefresh(): Promise<{ authToken: string | null, region: string | null, error?: any }> {
  const cookie = new Cookie();
  const speechToken = cookie.get('speech-token');

  if (speechToken === undefined) {
      try {
          const res = await getSpeechToken();
          const token = res.token;
          const region = res.region;

          if (token && region) {
              cookie.set('speech-token', region + ':' + token, {maxAge: 540, path: '/'});
              console.log('Token fetched from back-end: ' + token.slice(0,10));
              return { authToken: token, region: region };
          } else {
              throw res.error;
          }
      } catch (err: any) {
          console.log(err.data.error);
          return { authToken: null, region: null, error: err };
      }
  } else {
      console.log('Token fetched from cookie: ...' + speechToken.slice(-20));
      const idx = speechToken.indexOf(':');
      return { authToken: speechToken.slice(idx + 1), region: speechToken.slice(0, idx) };
  }
}
