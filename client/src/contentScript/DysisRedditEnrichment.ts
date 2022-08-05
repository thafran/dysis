import {DysisReddit} from './DysisReddit';
import {DysisRequest} from '../DysisRequest';
import {dysisConfig} from '../DysisConfig';

/**
 * DysisRedditEnrichment instances are created for each relevant (i.e. visible) user object 
 * (i.e. anchor tag element containing a user path) and manage the actual displying of the
 * Dysis information for a given identifier (i.e. username from the anchor element path).
 * Thereby this class represents the actual Enrichment for reddit.
 */
export class DysisRedditEnrichment {

  hostingElement: HTMLAnchorElement;
  injetionElement: HTMLElement;
  dysisContainer: HTMLElement;
  dysisTagContainer: HTMLElement;
  identifier: String;

  behaviorExamplesPromise: Promise<{
    success: string,
    message: string,
    data: {
      toxicity: {
        text: string, 
        value: number
      },
      severeToxicity: {
        text: string, 
        value: number
      },
      insult: {
        text: string, 
        value: number
      },
      identityAttack: {
        text: string, 
        value: number
      },
      threat: {
        text: string, 
        value: number
      },
      profanity: {
        text: string, 
        value: number
      },
    },
  }> = null;

  numberOfRequestAttempts: number = 0;

  LOWER_LIMIT_FOR_BEHAVIOR_UNCERTAIN_IN_PERCENT: number = dysisConfig.reddit.behavior.lowerLimitForUncertainInPercent;
  LOWER_LIMIT_FOR_BEHAVIOR_LIKELY_IN_PERCENT: number = dysisConfig.reddit.behavior.lowerLimitForLikelyInPercent;
  MAX_NUMBER_OF_SUBREDDITS: number = dysisConfig.reddit.interests.maxNumberOfDisplayedInterests;
  LOWER_BOUND_FOR_FAILED_REQUEST_TIMEOUT_IN_SECONDS: number = dysisConfig.requests.lowerBoundForFailedRequestTimeoutInSeconds;
  UPPER_BOUND_FOR_FAILED_REQUEST_TIMEOUT_IN_SECONDS: number = dysisConfig.requests.upperBoundForFailedRequestTimeoutInSeconds
  MAX_NUMBER_OF_REQUEST_ATTEMPTS: number = dysisConfig.requests.maxNumberOfRequestAttempts;

  constructor(hostingElement: HTMLAnchorElement) {
    this.identifier = DysisReddit.getUsernameParamFromPath(hostingElement.href);
    this.hostingElement = hostingElement;
    if (hostingElement.parentElement.id?.includes('UserInfoTooltip')) {
      this.injetionElement = hostingElement.parentElement.parentElement;
    } else {
      this.injetionElement = hostingElement;
    };
    if (dysisConfig.debug.displayEnrichmentInstancesCreated) {
      console.log(`Dysis User Enrichment created for "${this.identifier}"...`)
    }
    this.createContainerElement();
    this.displayLoading();
    this.displayData();
  }

  private createContainerElement() {
    const dysisContainer = document.createElement('div');
    dysisContainer.classList.add('dysis');

    this.injetionElement.parentElement.parentElement.parentElement.insertAdjacentElement('beforeend', dysisContainer);
    this.injetionElement.parentElement.parentElement.parentElement.classList.add('dysis-hosting-element');
    
    this.dysisContainer = dysisContainer;   

    const tagContainer = document.createElement('div');    
    this.dysisContainer.appendChild(tagContainer);
    this.dysisTagContainer = tagContainer
  }

  private async displayLoading() {
    const tagContainer = this.dysisTagContainer

    tagContainer.style.overflowWrap = 'anywhere';

    tagContainer.insertAdjacentHTML(
      'beforeend',
      `<span class="dysis-tag">
        <span class="dysis-text">
          <b>DYSIS</b> loading...  <div class="dysis-loader" style="display: inline-block"></div>
        </span>
      </span>`
    )
  }

  private async displayData() {
    this.numberOfRequestAttempts++;
    await this.requestData().then((response) => {
      const tagContainer = this.dysisTagContainer
      if (dysisConfig.debug.displayEnrichmentDataObjects) {
        console.log(response)
      }

      tagContainer.innerHTML = '';

      // Create behavioral tags
      if (response?.analytics?.perspective?.toxicity) {
        tagContainer.appendChild(
          this.createBehaviorElement(
            'toxicity',
            'toxicity',
            response.analytics.perspective.toxicity
          )
        )
      }
      if (response?.analytics?.perspective?.severeToxicity) {
        tagContainer.appendChild(
          this.createBehaviorElement(
            'severe toxicity',
            'severeToxicity',
            response.analytics.perspective.severeToxicity
          )
        )
      }
      if (response?.analytics?.perspective?.insult) {
        tagContainer.appendChild( 
          this.createBehaviorElement(
            'insult',
            'insult',
            response.analytics.perspective.insult
          )
        )
      }
      if (response?.analytics?.perspective?.identityAttack) {
        tagContainer.appendChild( 
          this.createBehaviorElement(
            'identity attack',
            'identityAttack',
            response.analytics.perspective.identityAttack
          )
        )
      }
      if (response?.analytics?.perspective?.threat) {
        tagContainer.appendChild( 
          this.createBehaviorElement(
            'threat',
            'threat',
            response.analytics.perspective.threat
          )
        )
      }
      if (response?.analytics?.perspective?.profanity) {
        tagContainer.appendChild( 
          this.createBehaviorElement(
            'profanity',
            'profanity',
            response.analytics.perspective.threat
          )
        )
      }

      // Create interests tags (max. 10)
      for (const interests of response.context.subreddits.slice(0, this.MAX_NUMBER_OF_SUBREDDITS)) {
        tagContainer.insertAdjacentHTML(
          'beforeend',
          this.createInterestsElement(interests.subreddit, interests.count)
        )
      }

      // Create activity tags
      if (response?.metrics?.averageScoreSubmissions) {
        tagContainer.insertAdjacentHTML(
          'beforeend',
          this.createMetricsElement(
            '\&#8709 score for submissions', 
            response.metrics.averageScoreSubmissions.toFixed(2).toString())
        )
      }
      if (response?.metrics?.averageScoreComments) {
        tagContainer.insertAdjacentHTML(
          'beforeend',
          this.createMetricsElement(
            '\&#8709 score for comments',
            response.metrics.averageScoreComments.toFixed(2).toString())
        )
      };
      if (response?.metrics?.totalComments) {
        tagContainer.insertAdjacentHTML(
          'beforeend',
          this.createMetricsElement(
            '# of comments',
            response.metrics.totalComments >= 249 ? '> 250' : response.metrics.totalComments)
        )
      }
      if (response?.metrics?.totalSubmissions) {
        tagContainer.insertAdjacentHTML(
          'beforeend',
          this.createMetricsElement(
            '# of submissions',
            response.metrics.totalSubmissions >= 249 ? '> 250' : response.metrics.totalSubmissions)
        )
      }
    }).catch(() => {
      const timeoutInMiliseconds: number = this.getRandomNumber(
        this.LOWER_BOUND_FOR_FAILED_REQUEST_TIMEOUT_IN_SECONDS * 1000,
        this.UPPER_BOUND_FOR_FAILED_REQUEST_TIMEOUT_IN_SECONDS * 1000,
      )
      setTimeout(
        (self = this) => {
          if (self.numberOfRequestAttempts <= self.MAX_NUMBER_OF_REQUEST_ATTEMPTS) {
            if (dysisConfig.debug.displayRequestTimeoutsAndRetries) {
              console.log(`Dysis requesting data again for ${self.identifier}`)
            };
            self.displayData();
          }
        },
        timeoutInMiliseconds,
      );
    });
  }

  private async requestData(): Promise<any> {
    const response = await DysisRequest.get(`api/reddit?identifier=${this.identifier}`);
    return response.data;
  }

  private createBehaviorElement(tagLabel: string, tagName: string, tagValue: number): HTMLSpanElement {
    let behaviorValueClass: string;
    if (tagValue >= this.LOWER_LIMIT_FOR_BEHAVIOR_LIKELY_IN_PERCENT / 100) {
      behaviorValueClass = 'dysis-tag-behavior-red';
    } else if (tagValue >= this.LOWER_LIMIT_FOR_BEHAVIOR_UNCERTAIN_IN_PERCENT / 100) {
      behaviorValueClass = 'dysis-tag-behavior-yellow';
    } else {
      behaviorValueClass = 'dysis-tag-behavior-green';
    }

    const outerAnchorElement: HTMLAnchorElement = document.createElement('a');
    outerAnchorElement.href = '#';

    const outerSpanElement: HTMLSpanElement = document.createElement('span');
    outerSpanElement.classList.add('dysis-tag');

    const leftSpanElement: HTMLSpanElement = document.createElement('span');
    leftSpanElement.classList.add('dysis-tag-left');
    leftSpanElement.classList.add('dysis-tag-behavior');
    leftSpanElement.innerText = `${tagLabel}`;

    const rightSpanElement: HTMLSpanElement = document.createElement('span');
    rightSpanElement.classList.add('dysis-tag-right');
    rightSpanElement.classList.add(behaviorValueClass);
    rightSpanElement.innerText = `${(tagValue * 100).toFixed(0).toString()}%`;

    outerAnchorElement.appendChild(outerSpanElement);
    outerSpanElement.appendChild(leftSpanElement);
    outerSpanElement.appendChild(rightSpanElement);

    outerAnchorElement.addEventListener(
      'click', 
      async () => {
        window.event.preventDefault();
        if (!outerAnchorElement.lastElementChild.classList.contains('dysis-tag-behavior-example')) {
          const exampleSpanElement: HTMLSpanElement = document.createElement('span');
          exampleSpanElement.classList.add('dysis-tag-behavior-example')
          exampleSpanElement.insertAdjacentHTML(
            'beforeend',
            `  loading detailed analysis... <div class="dysis-loader" style="display: inline-block"></div>  `
          );
          outerAnchorElement.appendChild(exampleSpanElement);
          const exampleText: string = await this.getExampleComment(tagName);
          exampleSpanElement.innerText = exampleText;
        } else {
          outerAnchorElement.removeChild(outerAnchorElement.lastElementChild);
        }
      }
    );
    return outerAnchorElement;
  }
  
  private createInterestsElement(tagName: string, tagValue: number): string {
    return `
    <a href="https://www.reddit.com/r/${tagName}" target="_blank">
      <span class="dysis-tag">
        <span class="dysis-tag-left dysis-tag-interests">
          ${tagName}
        </span>
        <span class="dysis-tag-right dysis-tag-interests">
          ${tagValue.toString()}
        </span>
      </span>
    </a>`;

    
  }

  private createMetricsElement(tagName: string, tagValue: string): string {
    return `
    <span class="dysis-tag">
      <span class="dysis-tag-left dysis-tag-metrics">
        ${tagName}
      </span>
      <span class="dysis-tag-right dysis-tag-metrics">
        ${tagValue}
      </span>
    </span>`;
  }

  private getRandomNumber(minInMilliseconds: number, maxInMillisconds: number): number {
    return Math.random() * (maxInMillisconds - minInMilliseconds) + minInMilliseconds;
  }

  private instanceIsInViewport(): boolean {
    const bounding = this.injetionElement.getBoundingClientRect();
    const result = (
      bounding.top >= 0 
      && bounding.left >= 0 
      && bounding.right <= window.innerWidth
      && bounding.bottom <= window.innerHeight
    )
    return result;
  }

  private async requestDetailedData(): Promise<any> {
    const result = DysisRequest.get(
      `/api/reddit/detailed?identifier=${this.identifier}`
    )
    return result;
  }
 
  private async getExampleComment(behavior: string): Promise<string> {
    if (this.behaviorExamplesPromise === null) {
      this.behaviorExamplesPromise = this.requestDetailedData();
      const behaviorExamples = await this.behaviorExamplesPromise;
      return behaviorExamples.data[behavior].text;
    } else {
      const behaviorExamples = await this.behaviorExamplesPromise;
      return behaviorExamples.data[behavior].text;
    }
  }
}
