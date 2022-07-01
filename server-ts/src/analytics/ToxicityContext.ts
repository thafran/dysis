import {ToxicityStategyI, ToxicityI} from './toxicity/ToxicityStategyInterface.js'
import {ToxicityStrategyPerspective} from './toxicity/ToxicityStrategyPerspective.js';
import {ToxicityStrategyTensorflow} from './toxicity/ToxicityStrategyTensorflow.js'

import log from '../helpers/log.js';

export class ToxicityContext {

  // private static toxicityStrategy: ToxicityStategyI = new ToxicityStrategyTensorflow();
  private static toxicityStrategy: ToxicityStategyI = new ToxicityStrategyPerspective();

  static async analyze(text: string): Promise<ToxicityI|Error> {
    log.info('TOXICITY CONTEXT', `Analyzing the following text:\n"${text.slice(0, 120)}"`)
    return this.toxicityStrategy.analyze(text)
  }

  static async compare(text: string): Promise<any> {
    log.info('TOXICITY CONTEXT', `Analyzing and comparing the following text:\n"${text.slice(0, 120)}"`)
    log.info('TOXICITY CONTEXT', 'Perspective API Call with Axios:')
    const toxicityStrategyPerspective = new ToxicityStrategyPerspective()
    console.log(await toxicityStrategyPerspective.analyze(text))
    log.info('TOXICITY CONTEXT', 'Tensorflow')
    const toxicityStrategyTensorflow = new ToxicityStrategyTensorflow()
    console.log(await toxicityStrategyTensorflow.analyze(text))
  }

}