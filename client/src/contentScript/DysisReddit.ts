import {DysisAbstract} from './DysisAbstract';
import {DysisRedditEnrichment} from './DysisRedditEnrichment';

import {dysisConfig} from '../DysisConfig';

/**
 * DysisReddit is the first module and enhances the public discussion platform reddit. Once the 
 * script below is injected, it scans the page for user elements which need to be appended
 * by Dysis. Once an element is detected, a DysisRedditEnrichment instance is created for it.
 */
export class DysisReddit implements DysisAbstract {
  page: HTMLElement;
  mutationObserver: MutationObserver;
  viewportObserver: IntersectionObserver;

  constructor(page: HTMLElement) {
    this.page = page;
  }

  init() {
    console.log('Initialized Dysis for Reddit ...')
    this.initMutationObserver();
    this.initViewportObserver();
  }

  /**
   * Initialize a mutation observer who observes all DOM changes to the page
   */
  initMutationObserver() {
    const config = {
      attributes: false,
      childList: true,
      subtree: true,
    };
    // Instantiate mutation observer with mutation callback
    this.mutationObserver = new MutationObserver(
      // Anonymous mutation callback function
      (mutationList: any) => {
        for (const mutation of mutationList) {
          if (dysisConfig.debug.displayMutationRecords) this.debugDisplayMutation(mutation);
          if (
            mutation.type === 'childList'       // Mutation is adding / removing elements
            && mutation.addedNodes.length > 0   // Mutation contains added nodes
          ) {    
            for (const addedNode of mutation.addedNodes) {
              this.getRelevantChildElementsFromElementNode(addedNode); 
            }
          }
        }
      }
    );
    // Start observing the page for configured mutations
    this.mutationObserver.observe(
      this.page,
      config,
    );
  }

  getRelevantChildElementsFromElementNode(node: Element) {
    if (node instanceof HTMLElement) {
      const anchorTags = node.getElementsByTagName('a');
      for (const element of anchorTags) {
        if (
          element.href.includes('/user/') 
          && element.innerHTML.includes(DysisReddit.getUsernameParamFromPath(element.href))
        ) {
          // Attach viewport observer to element
          this.attachViewportObserverToElement(element);
        }
      }
    }
  }

  attachViewportObserverToElement(element: Element) {
    function delayedObserver () {
      this.viewportObserver.observe(element)
    }
    setTimeout(delayedObserver.bind(this))
  }

  /**
   * Initialize an intersection observer who observes elements being in the viewport
   */
  initViewportObserver() {
    // Configurations (e.g. root margin and treshold can be fine tuned)
    const config = {
      // null means intersection root element is the viewport
      root: null,
      // margin can in- or decrease the size of the root
      rootMargin: '0px 0px 0px 0px',
      // treshold sets the fraction overlap required for a trigger
      threshold: 1
    }
    // Instantiate the intersection observer with a viewport callback
    this.viewportObserver = new IntersectionObserver(
      // Anonymous viewport observer callback function (fires as soon element is in viewport)
      (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
        for (const entry of entries) {
          // Condition checks if element is going inside viewport
          if (entry.isIntersecting && entry.target instanceof HTMLAnchorElement) {
            // To avoid firing for rapid scrolling the following timeout is used
            // which only means relevant code is called when the element is for longer
            // than the timeout value in ms in the view
            setTimeout(
              (self = this) => {
                // Check if after the timeout time has passed the element is still visible
                if (self.isInViewport(entry.target) && entry.target instanceof HTMLAnchorElement) {
                  // Create a Dysis Enrichment for the specified target which went into viewport
                  new DysisRedditEnrichment(entry.target);
                  // Unobserve target after first time the target has been in the viewport
                  observer.unobserve(entry.target);
                }
              },
              dysisConfig.reddit.timeoutUntilAnElementIsInViewportInMilliseconds,
            )
          }
        }
      },
      config,
    );
  }

  static getUsernameParamFromPath(path: String) {
    if (!path.match('\/user\/.+')) {
      return;
    }
    let username = path.replace('https://www.reddit.com/user/', '').slice(0, -1)
    return username;
  }

  private isInViewport(element: HTMLAnchorElement): boolean {
    const bounding = element.getBoundingClientRect();
    const result = bounding.top >= 0 && bounding.left >= 0 && bounding.right <= window.innerWidth && bounding.bottom <= window.innerHeight
    return result;
  }

  /**
   * Debug function to display mutations in console
   * @param mutation 
   */
  debugDisplayMutation(mutation: MutationRecord) {
    if (mutation.type === 'childList') {
      console.log('A child node has been added or removed.');
    } else if (mutation.type === 'attributes') {
      console.log('A ' + mutation.attributeName + ' attribute was modified.');
    }
    console.log(mutation)
  }
}
