import { PerspectiveStrategyI, PerspectiveI } from './strategies/PerspectiveStrategyInterface.js';
import PerspectiveStrategyGoogleClient from './strategies/PerspectiveStrategyGoogleClient.js';

import log from '../../helpers/log.js';

/**
 * This Perspective Context is quick implementation of the Strategy Pattern and allows to
 * use different Strategies to get a Perspective Analysis for a text. Just set the static member
 * perspectiveStrategy (which needs to implement the PerspectiveStrategyI). By calling the
 * method analyze() a Perspective Analysis will be returned.
 */
export default class PerspectiveContext {
  static perspectiveStrategy: PerspectiveStrategyI = new PerspectiveStrategyGoogleClient();
  // static perspectiveStrategy: PerspectiveStrategyI = new PerspectiveStrategyFetch();
  // static perspectiveStrategy: PerspectiveStrategyI = new PerspectiveStrategyTensorflow();

  static async analyze(text: string): Promise<PerspectiveI> {
    log.info('PERSPECTIVE', `Using strategy: ${this.perspectiveStrategy.constructor.name}`);
    log.info('PERSPECTIVE', `Analyzing the following text:\n"${text.slice(0, 560)} [...]"`);
    return this.perspectiveStrategy.analyze(text);
  }
}
