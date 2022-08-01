import axios, { AxiosPromise } from 'axios';

import { PerspectiveStrategyI, PerspectiveI } from './PerspectiveStrategyInterface.js';
import { limitByteSizeOfText } from '../../../helpers/utils.js';

/**
 * This implementation of a PerspectiveStrategy uses a direct fetch method call to
 * a perspective API endpoint with the Google API Key in the params.
 *
 * See the cURL example on the official documentation:
 * https://developers.perspectiveapi.com/s/docs-sample-requests
 */
export default class PerspectiveStrategyFetch implements PerspectiveStrategyI {
  async analyze(text: string): Promise<PerspectiveI> {
    const limitedText = limitByteSizeOfText(text, 20480, 10);
    const response = await this.postRequestToGooglePerspectiveAPI(limitedText);
    if (response.statusText === 'OK') {
      return this.googlePerspectiveAdapter(response.data);
    }
    throw Error('Error while calling perspective API');
  }

  private googlePerspectiveAdapter(input: any): PerspectiveI {
    const toxicity: PerspectiveI = {
      toxicity: input.attributeScores?.TOXICITY?.summaryScore.value ?? null,
      severeToxicity: input.attributeScores?.SEVERE_TOXICITY?.summaryScore.value ?? null,
      identityAttack: input.attributeScores?.IDENTITY_ATTACK?.summaryScore.value ?? null,
      insult: input.attributeScores?.INSULT.summaryScore?.value ?? null,
      threat: input.attributeScores?.THREAT.summaryScore?.value ?? null,
      profanity: input.attributeScores?.PROFANITY.summaryScore?.value ?? null,
    };
    return toxicity;
  }

  private postRequestToGooglePerspectiveAPI(text: string): AxiosPromise<any> {
    return axios.post(
      `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${process.env.GOOGLE_API_KEY}`,
      {
        comment: { text },
        requestedAttributes: {
          TOXICITY: {},
          SEVERE_TOXICITY: {},
          PROFANITY: {},
          IDENTITY_ATTACK: {},
          THREAT: {},
          INSULT: {},
        },
        doNotStore: true,
      },
      {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'Access-Control-Allow-Origin': '*',
        },
      },
    );
  }
}
