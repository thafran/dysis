import { dysisConfig } from "../DysisConfig";

export default class DysisTracking {

  public participantID: string;

  private MAX_IDLE_TIME_IN_SECONDS = dysisConfig.tracking.defaultMaxIdleTimeInSeconds;
  private TRACKING_INTERVAL_IN_SECONDS = dysisConfig.tracking.defaultTrackingIntervalInSeconds;

  private timeOfLastAction: number = Date.now();
  private browserActivityState: string = 'active';

  constructor() {
    if (this.didUserGiveConsent) {
      console.log('Dysis Tracking started ...');
      this.setDefaultLocalStorageValues();
      this.createBackgroundBrowserActivityStateListener();
      this.createTimeOfLastActivityListeners();
      this.track();
    }
  }

  private didUserGiveConsent(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.local.get(
          [
            'dysisParticipantAgreedToTerms',
            'dysisParticipantSubmitted',
            'dysisParticipantID',
          ], (res) => {
            this.participantID = res.dysisParticipantID;
            if (res.dysisParticipantAgreedToTerms && res.dysisParticipantSubmitted) {
              resolve(true);
            } else {
              resolve(false)
            }
          }
        );
      } catch (error) {
        reject(false)
      }
    })
  }

  private setDefaultLocalStorageValues() {
    chrome.storage.local.get(
    [
      'dysisUsageTime',

    ], (res) => {
      chrome.storage.local.set({
        dysisUsageTime: 'dysisUsageTime' in res ? res.dysisUsageTime : 0,
      });
    })
  }  

  private track() {
    setInterval(
      () => {
        this.tick();
      },
      this.TRACKING_INTERVAL_IN_SECONDS * 1000,
    )
  }

  private tick() {
    if (
      document.visibilityState === 'visible'
      && this.browserActivityState === 'active'
      && (Date.now() - this.timeOfLastAction) < this.MAX_IDLE_TIME_IN_SECONDS * 1000
    ) {
      this.increaseUsageTimeByOneTick();
      this.setRedditUsername();
    }
  }

  /**
   * Increases usage time by one tick which equals the TRACKING INTERVAL
   */
  private increaseUsageTimeByOneTick() {
    chrome.storage.local.get(
      ['dysisUsageTime'], (res) => {
        const dysisUsageTimeBeforeTick = res.dysisUsageTime;
        const dysisUsageTimeAfterTick = 
          dysisUsageTimeBeforeTick 
          + this.TRACKING_INTERVAL_IN_SECONDS;
        chrome.storage.local.set({
          dysisUsageTime: dysisUsageTimeAfterTick,
        })
      }
    )
  };

  /**
   * Searches the DOM for the reddit user name and writes it to local storage. 
   * If no user is logged in, empty str is set for reddit_user_name.
   */
  private setRedditUsername() {
    // var name = document.getElementById('USER_DROPDOWN_ID').innerText.split("\n")[0];
    var name_tag = document.getElementById('USER_DROPDOWN_ID').querySelectorAll('span')[3];
    if (name_tag == null){
      var name = "";
    } else {
      var name = name_tag.innerText;
    }

    chrome.storage.local.set({
      reddit_user_name: name,
    })
  }

  private createTimeOfLastActivityListeners() {
    const setTimeOfLastActivity = () => {
      this.timeOfLastAction = Date.now();
    }
    document.addEventListener('click', setTimeOfLastActivity);
    document.addEventListener('scroll', setTimeOfLastActivity);
    document.addEventListener('mousemove', setTimeOfLastActivity);
    document.addEventListener('keydown', setTimeOfLastActivity)
  }

  
  private createBackgroundBrowserActivityStateListener() {
    chrome.runtime.onMessage.addListener(
      (message) => {
        if ('browserActivityState' in message) {
          this.browserActivityState = message.browserActivityState;
        }
      }
    )
  }
}
