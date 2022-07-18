export abstract class DysisAbstract {

  page: HTMLElement;

  constructor(page: HTMLElement) {
    this.page = page;
  }

  abstract init(): void;
}