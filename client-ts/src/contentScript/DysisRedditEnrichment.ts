import {DysisReddit} from './DysisReddit';
import {DysisRequest} from './DysisRequest';

export class DysisRedditEnrichment {

  hostingElement: HTMLAnchorElement;
  dysisContainer: HTMLElement;
  dysisTagContainer: HTMLElement;
  identifier: String;

  constructor(hostingElement: HTMLAnchorElement) {
    this.hostingElement = hostingElement;
    this.identifier = DysisReddit.getUsernameParamFromPath(hostingElement.href);
    console.log(`Dysis User Enrichment created for "${this.identifier}"...`)
    this.createContainerElement();
    this.displayLoading();
    this.displayData();
  }

  private createContainerElement() {
    const dysisContainer = document.createElement('div');
    dysisContainer.classList.add('dysis');

    this.hostingElement.parentElement.insertAdjacentElement('beforeend', dysisContainer);
    this.hostingElement.parentElement.classList.add('dysis-hosting-element');
    
    this.dysisContainer = dysisContainer;   

    const tagContainer = document.createElement('div');    
    this.dysisContainer.appendChild(tagContainer);
    this.dysisTagContainer = tagContainer
  }

  private async displayLoading() {
    const tagContainer = this.dysisTagContainer

    tagContainer.style.overflowWrap = 'anywhere';

    tagContainer.insertAdjacentHTML('beforeend', `<span class="dysis-tag"><span class="dysis-text"><b>DYSIS</b> loading...  <div class="loader" style="display: inline-block"></div></span></span>`)
  }

  private async displayData() {
    await this.requestData().then((response) => {
      const tagContainer = this.dysisTagContainer

      console.log(response)

      tagContainer.innerHTML = '';

      if (response?.analytics?.perspective?.toxicity) {
        tagContainer.insertAdjacentHTML('beforeend', this.getBehaviorElement('toxicity', response.analytics.perspective.toxicity))
      }
      if (response?.analytics?.perspective?.severeToxicity) {
        tagContainer.insertAdjacentHTML('beforeend', this.getBehaviorElement('severe toxicity', response.analytics.perspective.severeToxicity))
      }
      if (response?.analytics?.perspective?.insult) {
        tagContainer.insertAdjacentHTML('beforeend', this.getBehaviorElement('insult', response.analytics.perspective.insult))
      }
      if (response?.analytics?.perspective?.identityAttack) {
        tagContainer.insertAdjacentHTML('beforeend', this.getBehaviorElement('identity attack', response.analytics.perspective.identityAttack))
      }
      if (response?.analytics?.perspective?.threat) {
        tagContainer.insertAdjacentHTML('beforeend', this.getBehaviorElement('threat', response.analytics.perspective.threat))
      }

      for (const interests of response.context.subredditsForComments.slice(0, 10)) {
        tagContainer.insertAdjacentHTML('beforeend', this.getInterestsElement(interests.subreddit, interests.count))
      }

      if (response?.metrics?.averageScoreSubmissions) {
        tagContainer.insertAdjacentHTML('beforeend', this.getMetricsElement('\&#8709 score for submissions', response.metrics.averageScoreSubmissions))
      }
      if (response?.metrics?.averageScoreComments) {
        tagContainer.insertAdjacentHTML('beforeend', this.getMetricsElement('\&#8709 score for comments', response.metrics.averageScoreComments))
      }
    });
  }

  private async requestData(): Promise<any> {
    const response = await DysisRequest.get(`reddit?identifier=${this.identifier}`);
    return response.data;
  }

  private getBehaviorElement(tagName: string, tagValue: number): string {
    let behaviorValueClass: string;
    if (tagValue >= 0.75) {
      behaviorValueClass = 'dysis-tag-behavior-red';
    } else if (tagValue >= 0.50) {
      behaviorValueClass = 'dysis-tag-behavior-yellow';
    } else {
      behaviorValueClass = 'dysis-tag-behavior-green';
    }
    return `<span class="dysis-tag"><span class="dysis-tag-left dysis-tag-behavior">${tagName}</span><span class="dysis-tag-right ${behaviorValueClass}">${(tagValue * 100).toFixed(0).toString()}%</span></span>`;
  }
  
  private getInterestsElement(tagName: string, tagValue: number): string {
    return `<span class="dysis-tag"><span class="dysis-tag-left dysis-tag-interests">${tagName}</span><span class="dysis-tag-right dysis-tag-interests">${tagValue.toString()}x</span></span>`;
  }

  private getMetricsElement(tagName: string, tagValue: number): string {
    return `<span class="dysis-tag"><span class="dysis-tag-left dysis-tag-metrics">${tagName}</span><span class="dysis-tag-right dysis-tag-metrics">${tagValue.toFixed(2).toString()}</span></span>`;
  }
  
}
