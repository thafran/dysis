import DysisBackgroundTracking from './DysisBackgroundTracking';

import {dysisConfig} from '../DysisConfig';

export default class DysisBackground {

  protected dysisParticipantFirstName: string;
  protected dysisParticipantLastName: string;
  protected dysisParticipantID: string;
  protected dysisParticipantAgreedToTerms: boolean = false;
  protected dysisParticipantSubmitted: boolean = false;
  protected dysisInstallationDate: number;

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

  protected onInstalled() {
    chrome.runtime.onInstalled.addListener(() => {
      console.log('Dysis extension successfully installed ...')
      chrome.storage.local.set({
        dysisInstallationDate: Date.now(),
      });
    })
  }

  protected setDefaultValues() {
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

  protected getLocalStorageValues() {
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

  protected afterGetLocalStorageValues() {
    this.initTrackers();
  }

  protected initTrackers() {
    if (this.dysisParticipantAgreedToTerms && this.dysisParticipantSubmitted) {
      new DysisBackgroundTracking(
        'reddit',
        'reddit.com',
        this.dysisParticipantID,
      );
    }
  }

  protected localStorageCallback(changes: chrome.storage.StorageChange, namespace: chrome.storage.AreaName, self: DysisBackground) {
    for (let [key] of Object.entries(changes)) {
      if (namespace === 'local' && key === 'dysisParticipantSubmitted') {
        self.getLocalStorageValues();
        self.initTrackers();
      }
    }
  }
  
  protected createListenerForLocalStorageChanges() {
    chrome.storage.onChanged.addListener((changes, namespace) => {
      this.localStorageCallback(changes, namespace, this)
    });
  }

  protected debugDisplayMutationRecords() {
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