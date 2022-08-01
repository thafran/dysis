import { google } from 'googleapis';

const DISCOVERY_URL = 'https://commentanalyzer.googleapis.com/$discovery/rest?version=v1alpha1';

/**
 * This function is used by the PerspectiveStategyGoogleClient and allows to use the library
 * from Google to call its perspectiv API endpoint.
 *
 * See GitHub repository:
 * https://www.npmjs.com/package/@tensorflow-models/toxicity
 */
export default async function analyzeRequest(text, googleApiKey) {
  async function getClient() {
    const client = await google.discoverAPI(DISCOVERY_URL);
    return client;
  }

  return new Promise(async (resolve, reject) => {
    const request = {
      comment: {
        text,
      },
      requestedAttributes: {
        TOXICITY: {},
        SEVERE_TOXICITY: {},
        IDENTITY_ATTACK: {},
        THREAT: {},
        INSULT: {},
        PROFANITY: {},
      },
      doNotStore: true,
    };
    const client = await getClient();
    client.comments.analyze(
      {
        key: googleApiKey,
        resource: request,
      },
      (error, response) => {
        if (error) {
          reject(error);
        }
        resolve(response);
      },
    );
  });
}
