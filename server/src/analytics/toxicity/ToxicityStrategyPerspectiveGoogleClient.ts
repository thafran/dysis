import {analyzeRequest} from './ToxicityStrategyPerspectiveGoogleClientImplementation.js';
import dotenv from 'dotenv';

import {ToxicityStategyI, ToxicityI} from './ToxicityStategyInterface.js';
import {limitByteSizeOfText} from '../../helpers/utils.js';

export class ToxicityStrategyPerspectiveGoogleClient implements ToxicityStategyI {

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
    text = limitByteSizeOfText(text, 20480, 10)
    const response = await analyzeRequest(text, this.googleApiKey);
    if (response) {
      return this.googleClientAdapter(response.data);
    } else {
      throw Error('Error while calling perspective API')
    }
  }

  private googleClientAdapter(googleClientToxicity: any): any {
    const toxicity: ToxicityI = {
      toxicity: googleClientToxicity.attributeScores?.TOXICITY?.summaryScore.value ?? null,
      severeToxicity: googleClientToxicity.attributeScores?.SEVERE_TOXICITY?.summaryScore.value ?? null,
      identityAttack: googleClientToxicity.attributeScores?.IDENTITY_ATTACK?.summaryScore.value ?? null,
      insult: googleClientToxicity.attributeScores?.INSULT.summaryScore?.value ?? null,
      threat: googleClientToxicity.attributeScores?.THREAT.summaryScore?.value ?? null,
      profanity: googleClientToxicity.attributeScores?.PROFANITY.summaryScore?.value ?? null,
    }
    return toxicity;
  }
}
