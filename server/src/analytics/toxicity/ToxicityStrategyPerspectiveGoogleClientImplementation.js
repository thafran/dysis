/* eslint-disable require-jsdoc */
import {google} from 'googleapis';

const DISCOVERY_URL = 'https://commentanalyzer.googleapis.com/$discovery/rest?version=v1alpha1';

async function getClient() {
  const client = await google.discoverAPI(DISCOVERY_URL);
  return client;
}

export async function analyzeRequest(text, googleApiKey) {
  return new Promise(async function(resolve, reject) {
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
