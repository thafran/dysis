import {ToxicityStategyI, ToxicityI} from './toxicity/ToxicityStategyInterface.js'
import {ToxicityStrategyPerspectiveFetch} from './toxicity/ToxicityStrategyPerspectiveFetch.js';
import {ToxicityStrategyTensorflow} from './toxicity/ToxicityStrategyTensorflow.js'

import log from '../helpers/log.js';
import { ToxicityStrategyPerspectiveGoogleClient } from './toxicity/ToxicityStrategyPerspectiveGoogleClient.js';

export class ToxicityContext {

  // private static toxicityStrategy: ToxicityStategyI = new ToxicityStrategyTensorflow();
  // private static toxicityStrategy: ToxicityStategyI = new ToxicityStrategyPerspectiveFetch();
  private static toxicityStrategy: ToxicityStategyI = new ToxicityStrategyPerspectiveGoogleClient();

  static async analyze(text: string): Promise<ToxicityI> {
    log.info('TOXICITY', `Using strategy: ${this.toxicityStrategy.constructor.name}`)
    log.info('TOXICITY', `Analyzing the following text:\n"${text.slice(0, 560)} [...]"`)
    return this.toxicityStrategy.analyze(text)
  }

  static async compare(text: string): Promise<any> {
    log.info('TOXICITY', `Analyzing and comparing the following text:\n"${text.slice(0, 120)}"`)
    log.info('TOXICITY', 'Perspective API Call with Axios:')
    const toxicityStrategyPerspective = new ToxicityStrategyPerspectiveFetch()
    console.log(await toxicityStrategyPerspective.analyze(text))
    log.info('TOXICITY', 'Tensorflow')
    const toxicityStrategyTensorflow = new ToxicityStrategyTensorflow()
    console.log(await toxicityStrategyTensorflow.analyze(text))
  }
}