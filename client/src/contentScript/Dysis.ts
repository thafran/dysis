import {DysisUsage} from './DysisUsage';
import {DysisAbstract} from './DysisAbstract';
import {DysisReddit} from './DysisReddit';
import {DysisZeit} from './DysisZeit';

export default class Dysis {
  usage: DysisUsage;
  modules: DysisAbstract[];
  constructor() {
    console.log('Dysis App started ...')

    this.usage = new DysisUsage();

    this.modules = [
      // Add modules to this array
      new DysisReddit(document.body),
      new DysisZeit(document.body),
    ]
    this.init();
  }

  init() {
    for (const module of this.modules) {
      module.init();
    }
  }
}

const dysis: Dysis = new Dysis();
