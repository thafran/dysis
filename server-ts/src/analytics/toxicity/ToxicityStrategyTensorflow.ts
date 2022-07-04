import toxicity from '@tensorflow-models/toxicity';

import {ToxicityStategyI, ToxicityI} from './ToxicityStategyInterface';

export class ToxicityStrategyTensorflow implements ToxicityStategyI {
  constructor() {
    this.init();
  }

  init(): void {
    console.log('Tensorflow Strategy')
  }

  async analyze(text: string): Promise<ToxicityI> {
    const prediction = await this.tensorflowToxicity(text);
    return this.tensorflowToxicityAdapter(prediction);
  }

  async tensorflowToxicity(text: string) {
    const threshold: number = 0.9;
    const model = await toxicity.load(threshold, []);
    console.log(`Getting Tensorflow Toxicity for:\n"${text}"`);
    const prediction = await model.classify(text);
    return prediction;
  }

  private tensorflowToxicityAdapter(tensorflowToxicity: any): ToxicityI {
    const toxicity: ToxicityI = {}
    for (const element of tensorflowToxicity) {
      switch(element.label) {
        case('toxicity'): 
          toxicity.toxicity = element.results[0].probabilities["1"];
          break;
        case('identity_attack'):
          toxicity.identityAttack = element.results[0].probabilities["1"];
          break;
        case('insult'):
          toxicity.insult = element.results[0].probabilities["1"];
          break;
        case('severe_toxicity'):
          toxicity.severeToxicity = element.results[0].probabilities["1"];
          break;
        case('threat'):
          toxicity.threat = element.results[0].probabilities["1"];
          break;
      }
    }
    return toxicity;
  }
}