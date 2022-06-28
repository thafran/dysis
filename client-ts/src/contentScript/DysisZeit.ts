import {DysisAbstract} from './DysisAbstract';

export class DysisZeit implements DysisAbstract {
  page: HTMLElement;

  constructor(page: HTMLElement) {
    this.page = page;
  }

  init() {
    // This could be a future module
  }

}