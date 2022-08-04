import {dysisConfig} from '../DysisConfig';

import {DysisRequest} from '../DysisRequest';

export default class DysisBackgroundTracking {

  private trackingSiteName: string; 
  private trackingSiteUrl: string;
  private trackingIntervalInSeconds: number;
  private syncIntervalInSeconds: number;
  
  private backgroundAlarmVariableName: string;
  private backgroundTimeVariableName: string;
  private usageTimeVariableName: string;
  private lastTimeAlarmRangVariableName: string;

  private browserActivityState: string = 'active'
  private participantID: string;

  constructor(
    // Constructor parameters
    trackingSiteName: string,
    trackingSiteUrl: string,
    participantName: string,
    trackingIntervalInSeconds: number = dysisConfig.sync.defaultTrackingIntervalInSeconds,
    syncIntervalInSeconds: number = dysisConfig.sync.defaultSyncIntervalInSeconds,
  ) {
    // Set variables
    this.trackingSiteName = trackingSiteName;
    this.trackingSiteUrl = trackingSiteUrl;
    this.trackingIntervalInSeconds = trackingIntervalInSeconds;
    this.syncIntervalInSeconds = syncIntervalInSeconds;
    this.participantID = participantName;
    // Set derived variables
    this.backgroundAlarmVariableName = `${this.trackingSiteName}Tracking`;
    this.backgroundTimeVariableName = `${this.trackingSiteName}BackgroundTimer`;
    this.usageTimeVariableName = `${this.trackingSiteName}UsageTimeTotal`;
    this.lastTimeAlarmRangVariableName = `${this.trackingSiteName}LastTimeAlarmRang`;
    // Initialize
    this.init()
  }

  private init() {
    this.setDefaultLocalStorageValues();
    this.createBrowserActivityStateDetector();
    this.createExtensionBackgroundAlarm();
    this.createExtensionBackgroundOnAlarm();
  }

  private setDefaultLocalStorageValues() {
    // Setting default values in local storage (to make sure they are there and set to a default)
    chrome.storage.local.get(
      [
        this.backgroundTimeVariableName,
        this.usageTimeVariableName,
        this.lastTimeAlarmRangVariableName,
      ], (res) => {
      chrome.storage.local.set({
        [this.backgroundTimeVariableName]: 
          this.backgroundTimeVariableName in res ? res[this.backgroundTimeVariableName]: 0,
        [this.usageTimeVariableName]: 
          this.usageTimeVariableName in res ? res[this.usageTimeVariableName] : 0,
        [this.lastTimeAlarmRangVariableName]:
          this.lastTimeAlarmRangVariableName in res ? res[this.lastTimeAlarmRangVariableName] : Date.now(),
      });
    });
  }

  private createBrowserActivityStateDetector() {
    // Adds an event listener which will fire and set the browser activity state every time a
    // a state change is detected
    chrome.idle.onStateChanged.addListener(
      (browserActivityState) => {
        console.log(`State change to '${this.browserActivityState}' detected`);
        this.browserActivityState = browserActivityState;
      }
    )
  }

  private createExtensionBackgroundAlarm() {
    // Create interval for background script
    //
    // Caution: Be aware that Chrome does not reliably tolerate alarms firing more frequently
    // then once a minute (so the minimum is 60 seconds for tracking), one exception is
    // in unpacked chrome extension Chrome allows more frequent alarms (see the following link:
    // https://developer.chrome.com/docs/extensions/reference/alarms/#method-create)
    chrome.alarms.create(this.backgroundAlarmVariableName, {
      periodInMinutes: this.trackingIntervalInSeconds / 60
    });
  }

  private createExtensionBackgroundOnAlarm() {
    // Creates an event listener listening to all alarms firing in Chrome
    chrome.alarms.onAlarm.addListener((alarm) => {
      // If the firing event listener is the one of this instance execute the subsequent code
      if (alarm.name == this.backgroundAlarmVariableName) {
        // Retrieve the total and increment usage time from the extension's local storage
        chrome.storage.local.get(
          [
            this.usageTimeVariableName,
            this.backgroundTimeVariableName,
            this.lastTimeAlarmRangVariableName,
          ], (res) => {
            // Create local variables from the retrieved local storage
            let usageTime: number = res[this.usageTimeVariableName];
            let backgroundTime: number = res[this.backgroundTimeVariableName];
            let lastTimeAlarmRang: number = res[this.lastTimeAlarmRangVariableName];
            // Calculate time passed because Google Alarm interval is per definition not reliable
            let timePassedSinceLastAlarmInSeconds = ((Date.now() - lastTimeAlarmRang) / 1000);
            // Increase background time and set it
            backgroundTime += timePassedSinceLastAlarmInSeconds
            chrome.storage.local.set({
              [this.backgroundTimeVariableName]: backgroundTime,
              [this.lastTimeAlarmRangVariableName]: Date.now(),
            });
            // Sync according according to the given sync interval based on background time
            if (Math.floor(backgroundTime) % this.syncIntervalInSeconds === 0) {
              // This code that be executed to sync the usage time
              this.syncUsageTime(usageTime);
              if (dysisConfig.debug.displaySyncing) {
                console.log('Dysis syncing ...');
              }
            }
            // Asyncly get the active tab
            this.isCurrentActiveTab().then((isCurrentActiveTab) => {
              // Usage times should only increase if the following conditions for a 'tick' are met:
              // 1) The current active tab matches the url of this instance
              // 2) The browser state is as active (can also be idle or locked)
              if (isCurrentActiveTab && this.browserActivityState === 'active') {
                // Increase the usage times by one 'tick'
                usageTime += timePassedSinceLastAlarmInSeconds;
                // Log a tick to the console if set in globalConfig
                if (dysisConfig.debug.displayUsageTimeTicks) {
                  console.log(`Tick for ${this.trackingSiteName} (Total usage time: ${usageTime}s)`)
                }
                // Set the new increased usage times
                chrome.storage.local.set({
                  [this.usageTimeVariableName]: usageTime,
                });
              } 
            }
          );
        });
      }
    });    
  }

  private async syncUsageTime(usageTime: number) {
    const response = await DysisRequest.post(
      'tracking/update/dysis',
      {
        'participantID': this.participantID,
        'totalUsageTime': Math.floor(usageTime),
      }
    )
    if (response) {
      if (dysisConfig.debug.displaySyncingInformation) {
        console.log(response);
      }
    } else {
      console.log('Dysis sync error ...')
    }
  } 

  private async isCurrentActiveTab(): Promise<boolean> {
    // Retrieves the open tabs which are active and in focus
    const tabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    // Returns true if the active and focused tab matches the tracking site URL
    return tabs.length > 0 && tabs[0].url.includes(this.trackingSiteUrl);
  }
}
