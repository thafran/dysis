import {DysisAbstract} from './DysisAbstract';
import {DysisReddit} from './DysisReddit';
import {DysisZeit} from './DysisZeit';

/**
 * The Dysis class is loaded via the content script which is injected in relevant websites
 * and enriches these. As the extension has been conceptualized with modulabity in mind,
 * further modules besides can be added. Initially reddit is supported. An exemplary future
 * module could be zeit. Modules need to implement DysisAbstract and own a init() method.
 * Add them to the array of modules in the constructor with the page HTML element as parameter.
 */
export default class Dysis {
  modules: DysisAbstract[];
  constructor() {
    console.log('Dysis App started ...')

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
