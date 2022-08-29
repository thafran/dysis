import DysisBackgroundSync from './DysisBackgroundSync';

export default class DysisBackground {

  private dysisParticipantID: string;
  private dysisParticipantAgreedToTerms: boolean = false;
  private dysisParticipantSubmitted: boolean = false;

  constructor() {
    console.log('Dysis background script initiated ...')
    this.setDefaultValues();
    this.onInstalled();
    this.getLocalStorageValuesAndInitSync();
    this.createBrowserActivityStateDetector();
    this.listenForLocalStorageChangesWhichRequireToReevaluteSync();
  }

  private onInstalled() {
    // On installation event listener listening for installation event
    chrome.runtime.onInstalled.addListener(() => {
      console.log('Dysis extension successfully installed ...')
      // Get local storage values to check if participant already takes part in study 
      // which means they agreed to terms and submitted in the options panel
      chrome.storage.local.get(
      [
        'dysisInstallationDate',
        'dysisParticipantAgreedToTerms',
        'dysisParticipantSubmitted',
      ], (res) => {
        // If there is no installation date set (because never installed or removed and 
        // installed instead of simple re-install) set installation date
        if (!('dysisInstallationDate' in res)) {
          chrome.storage.local.set({
            dysisInstallationDate: new Date().toISOString(),
          });
        }
        // If participant does not yet take part in study and (re-) installs extension, 
        // open options view to remind them of signing up
        if (!res.dysisParticipantAgreedToTerms && !res.dysisParticipantSubmitted) {
          chrome.tabs.create(
            { url: `chrome-extension://${chrome.runtime.id}/options.html` },
            () => {}
          );
        }
      })
    })
  }

  private setDefaultValues() {
    chrome.storage.local.get(
      [
        'dysisParticipantFirstName',
        'dysisParticipantLastName',
        'dysisParticipantID',
        'dysisParticipantAgreedToTerms',
        'dysisParticipantSubmitted',
      ], (res) => {
      chrome.storage.local.set({
        dysisParticipantFirstName: 
          'dysisParticipantFirstName' in res ? res.dysisParticipantFirstName : '',
        dysisParticipantLastName:
          'dysisParticipantLastName' in res ? res.dysisParticipantLastName : '',
        dysisParticipantID:
          'dysisParticipantID' in res ? res.dysisParticipantID : null,
        dysisParticipantAgreedToTerms:
          'dysisParticipantAgreedToTerms' in res ? res.dysisParticipantAgreedToTerms : false,
        dysisParticipantSubmitted:
          'dysisParticipantSubmitted' in res ? res.dysisParticipantSubmitted : false,
      })
    });
  }

  private getLocalStorageValuesAndInitSync() {
    chrome.storage.local.get(
      [
        'dysisParticipantID',
        'dysisParticipantAgreedToTerms',
        'dysisParticipantSubmitted',
      ], (res) => {
        this.dysisParticipantID = res.dysisParticipantID
        this.dysisParticipantAgreedToTerms = res.dysisParticipantAgreedToTerms;
        this.dysisParticipantSubmitted = res.dysisParticipantSubmitted;
        // Notice: As receiving local storage values is asynchronous, everything that
        // depends on the values being updated should be performed in afterGetLocalStorageValues()
        this.afterGetLocalStorageValues();
      }
    );
  }

  private afterGetLocalStorageValues() {
    this.initSync();
  }

  private initSync() {
    if (this.dysisParticipantAgreedToTerms && this.dysisParticipantSubmitted) {
      new DysisBackgroundSync(this.dysisParticipantID)
    }
  }
  
  private createBrowserActivityStateDetector() {
    // Adds an event listener which will fire and set the browser activity state every time a
    // a state change is detected and send it to the active tab content script
    chrome.idle.onStateChanged.addListener(
      (browserActivityState) => {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
          if (tabs[0]?.url?.match('https:\/\/.*.reddit.com\/.*')) {
            chrome.tabs.sendMessage(tabs[0].id, { browserActivityState: browserActivityState });
          }
        });
      }
    )
  }

  private listenForLocalStorageChangesWhichRequireToReevaluteSync() {
    const callback = (
      changes: chrome.storage.StorageChange, 
      namespace: 'sync' | 'local' | 'managed'
    ) => {
      for (let [key] of Object.entries(changes)) {
        if (namespace === 'local' && key === 'dysisParticipantSubmitted') {
          this.getLocalStorageValuesAndInitSync();
        }
      }
    }
    chrome.storage.onChanged.addListener((changes, namespace) => {
      callback(changes, namespace)
    });
  }
  
  private debugDisplayMutationRecords() {
    chrome.storage.onChanged.addListener(function (changes, namespace) {
      for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        console.log(
          `Storage key '${key}' in namespace '${namespace}' changed.`,
          `Old value was '${oldValue}', new value is '${newValue}'.`
        );
      }
    });
  }
}