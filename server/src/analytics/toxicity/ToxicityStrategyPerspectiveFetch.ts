import axios, { AxiosPromise } from 'axios';
import dotenv from 'dotenv';

import {ToxicityStategyI, ToxicityI} from './ToxicityStategyInterface';

export class ToxicityStrategyPerspectiveFetch implements ToxicityStategyI {

  private googleApiKey: string;

  constructor() {
    dotenv.config();
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error('Google API key not set in .env-file')
    } else {
      this.googleApiKey = process.env.GOOGLE_API_KEY
    }
  }

  async analyze(text: string): Promise<ToxicityI> {
    const response = await this.postRequestToGooglePerspectiveAPI(text);
    if (response.statusText === 'OK') {
      return this.googlePerspectiveAdapter(response.data);
    } else {
      throw Error('Error while calling perspective API')
    }
  }

  private googlePerspectiveAdapter(tensorflowToxicity: any): ToxicityI {
    const toxicity: ToxicityI = {
      toxicity: tensorflowToxicity.attributeScores?.TOXICITY?.summaryScore.value ?? null,
      severeToxicity: tensorflowToxicity.attributeScores?.SEVERE_TOXICITY?.summaryScore.value ?? null,
      identityAttack: tensorflowToxicity.attributeScores?.IDENTITY_ATTACK?.summaryScore.value ?? null,
      insult: tensorflowToxicity.attributeScores?.INSULT.summaryScore?.value ?? null,
      threat: tensorflowToxicity.attributeScores?.THREAT.summaryScore?.value ?? null,
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