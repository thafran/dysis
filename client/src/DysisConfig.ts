export const dysisConfig = {
  server: {
    baseUrl: 'https://dysis-server.herokuapp.com/'
    // baseUrl: 'http://localhost:8080/'
  },
  requests: {
    lowerBoundForFailedRequestTimeoutInSeconds: 5,
    upperBoundForFailedRequestTimeoutInSeconds: 10,
    maxNumberOfRequestAttempts: 3,
  },
  sync: {
    showNotificationWhenSyncing: false,
    defaultTrackingIntervalInSeconds: 1, // Consider Chrome limitations with less then 60 as value
    defaultSyncIntervalInSeconds: 60,
  },
  debug: {
    displayMutationRecords: false,
    displayLocalStorageChanges: false,
    displayUsageTimeTicks: false,
    displayEnrichmentDataObjects: false,
    displayEnrichmentInstancesCreated: false,
    displaySyncingInformation: false,
    displaySyncing: false,
    displayRequestTimeoutsAndRetries: false,
    displayEnrichmentElementCreated: false,
  },
  reddit: {
    timeoutUntilAnElementIsInViewportInMilliseconds: 125,
    behavior: {
      lowerLimitForUncertainInPercent: 60,
      lowerLimitForLikelyInPercent: 80,
    },
    interests: {
      maxNumberOfDisplayedInterests: 10,
    }
  },
}
