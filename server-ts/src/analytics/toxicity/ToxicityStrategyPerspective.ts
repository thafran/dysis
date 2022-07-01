import axios, { AxiosPromise } from 'axios';

import {ToxicityStategyI, ToxicityI} from './ToxicityStategyInterface';

export class ToxicityStrategyPerspective implements ToxicityStategyI {

  private googleApiKey: string;

  constructor() {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error('Google API key not set in .env-file')
    } else {
      this.googleApiKey = process.env.GOOGLE_API_KEY
    }
  }

  async analyze(text: string): Promise<ToxicityI | Error> {
    const response = await this.postRequestToGooglePerspectiveAPI(text);
    if (response.statusText === 'OK') {
      return this.googlePerspectiveAdapter(response.data);
    } else {
      return Error('Error while calling perspective API')
    }
  }

  private googlePerspectiveAdapter(tensorflowToxicity: any): ToxicityI {
    const toxicity: ToxicityI = {
      toxicity: tensorflowToxicity.attributeScores.TOXICITY.summaryScore.value,
      severeToxicity: tensorflowToxicity.attributeScores.SEVERE_TOXICITY.summaryScore.value,
      identityAttack: tensorflowToxicity.attributeScores.IDENTITY_ATTACK.summaryScore.value,
      insult: tensorflowToxicity.attributeScores.INSULT.summaryScore.value,
      threat: tensorflowToxicity.attributeScores.THREAT.summaryScore.value,
    }
    return toxicity;
  }


  postRequestToGooglePerspectiveAPI(text: string): AxiosPromise<any> {
    return axios.post(
      `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${this.googleApiKey}`,
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
      },
      { 
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'Access-Control-Allow-Origin': '*',
        }
      },
    )
  }
}