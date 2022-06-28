import {DysisReddit} from './DysisReddit';
import {DysisRequest} from './DysisRequest';

export class DysisRedditEnrichment {

  hostingElement: HTMLAnchorElement;
  identifier: String;
  dysis: HTMLElement;

  constructor(hostingElement: HTMLAnchorElement) {
    this.hostingElement = hostingElement;
    this.identifier = DysisReddit.getUsernameParamFromPath(hostingElement.href);
    console.log(`Dysis User Enrichment created for "${this.identifier}"...`)
    this.createElement();
    this.displayLoading();
    this.displayData();
  }

  createElement() {
    const dysis = document.createElement('span');
    dysis.classList.add('dysis');
    dysis.style.color = '#BF0000';
    const text = document.createElement('span');
    text.classList.add('dysis');
    text.style.color = '#BF0000';
    text.innerText = `  DYSIS loading ...  `;
    this.hostingElement.appendChild(dysis);
    this.dysis = dysis;
    this.dysis.appendChild(text);
    
  }

  displayLoading() {
    const loadingCirle = document.createElement('div');
    loadingCirle.style.display = 'inline-block';
    loadingCirle.classList.add('loader');
    this.dysis.appendChild(loadingCirle);
  }

  async displayData() {
    const response = await this.requestData();
    console.log(response);
    this.dysis.innerText = `  ${JSON.stringify(response)}  `;
  }

  async requestData(): Promise<any> {
    const response = await DysisRequest.get(`reddit?identifier=${this.identifier}`);
    return response.data;
  }
}