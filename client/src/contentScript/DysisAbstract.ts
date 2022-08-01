/**
 * Defines abstractly how a Dysis module for the content script needs to look like.
 * All Dysis modules need to implement an init() method and have a page of type HTML element
 * which is the entry point for a given module.
 */
export abstract class DysisAbstract {

  page: HTMLElement;

  constructor(page: HTMLElement) {
    this.page = page;
  }

  abstract init(): void;
}