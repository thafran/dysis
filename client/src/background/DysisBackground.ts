import DysisBackgroundTracking from './DysisBackgroundTracking';

import {dysisConfig} from '../DysisConfig';

export default class DysisBackground {

  private dysisParticipantFirstName: string;
  private dysisParticipantLastName: string;
  private dysisParticipantID: string;
  private dysisParticipantAgreedToTerms: boolean = false;
  private dysisParticipantSubmitted: boolean = false;
  private dysisInstallationDate: string;

  constructor() {
    console.log('Dysis background script initiated ...')
    this.onInstalled();
    this.setDefaultValues();
    this.getLocalStorageValues();
    this.createListenerForLocalStorageChanges();
    if (dysisConfig.debug.displayLocalStorageChanges) {
      this.debugDisplayMutationRecords();
    }
  }

  private onInstalled() {
    // On installation event listener listening for installation event
    chrome.runtime.onInstalled.addListener(() => {
      console.log('Dysis extension successfully installed ...')
      // Get local storage values to check if participant already takes part in study (agreed to terms and submitted)
      chrome.storage.local.get(
      [
        'dysisInstallationDate',
        'dysisParticipantAgreedToTerms',
        'dysisParticipantSubmitted',
      ], (res) => {
        // If there is no installation date set (because never installed or removed and installed instead of simple re-install) set installation date
        if (!res.dysisInstallationDate) {
          const date: Date = new Date();
          chrome.storage.local.set({
            dysisInstallationDate: date.toISOString(),
          });
        }
        // If participant does not yet take part in study and (re-) installs extension, open options view
        if (!res.dysisParticipantAgreedToTerms && !res.dysisParticipantSubmitted) {
          chrome.tabs.create({url: `chrome-extension://${chrome.runtime.id}/options.html`}, () => {});
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
        'dysisInstallationDate',
      ], (res) => {
      chrome.storage.local.set({
        dysisParticipantFirstName: 'dysisParticipantFirstName' in res ? res.dysisParticipantFirstName : '',
        dysisParticipantLastName: 'dysisParticipantLastName' in res ? res.dysisParticipantLastName : '',
        dysisParticipantID: 'dysisParticipantID' in res ? res.dysisParticipantID : null,
        dysisParticipantAgreedToTerms: 'dysisParticipantAgreedToTerms' in res ? res.dysisParticipantAgreedToTerms : false,
        dysisParticipantSubmitted: 'dysisParticipantSubmitted' in res ? res.dysisParticipantSubmitted : false,
      })
    });
  }

  private getLocalStorageValues() {
    chrome.storage.local.get(
      [
        'dysisParticipantFirstName',
        'dysisParticipantLastName',
        'dysisParticipantID',
        'dysisParticipantAgreedToTerms',
        'dysisParticipantSubmitted',
        'dysisInstallationDate',
      ], (res) => {
        this.dysisParticipantFirstName = res.dysisParticipantFirstName;
        this.dysisParticipantLastName = res.dysisParticipantLastName
        this.dysisParticipantID = res.dysisParticipantID
        this.dysisParticipantAgreedToTerms = res.dysisParticipantAgreedToTerms;
        this.dysisParticipantSubmitted = res.dysisParticipantSubmitted;
        this.dysisInstallationDate = res.dysisInstallationDate;
        // Notice: As receiving local storage values is asynchronous, everything that
        // depends on the values being updated should be performed in afterGetLocalStorageValues()
        this.afterGetLocalStorageValues();
      }
    );
  }

  private afterGetLocalStorageValues() {
    this.initTrackers();
  }

  private initTrackers() {
    if (this.dysisParticipantAgreedToTerms && this.dysisParticipantSubmitted) {
      new DysisBackgroundTracking(
        'reddit',
        'reddit.com',
        this.dysisParticipantID,
      );
    }
  }

  private localStorageCallback(changes: chrome.storage.StorageChange, namespace: chrome.storage.AreaName, self: DysisBackground) {
    for (let [key] of Object.entries(changes)) {
      if (namespace === 'local' && key === 'dysisParticipantSubmitted') {
        self.getLocalStorageValues();
        self.initTrackers();
      }
    }
  }
  
  private createListenerForLocalStorageChanges() {
    chrome.storage.onChanged.addListener((changes, namespace) => {
      this.localStorageCallback(changes, namespace, this)
    });
  }

  private debugDisplayMutationRecords() {
    chrome.storage.onChanged.addListener(function (changes, namespace) {
      for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        console.log(
          `Storage key "${key}" in namespace "${namespace}" changed.`,
          `Old value was "${oldValue}", new value is "${newValue}".`
        );
      }
    });
  }
}