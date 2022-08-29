const DEBUG = false;

export const dysisConfig = {
  server: {
    baseUrl: DEBUG ? 'http://localhost:8080/' : 'https://dysis-server.herokuapp.com/'
  },
  tracking: {
    defaultMaxIdleTimeInSeconds: 40,
    defaultTrackingIntervalInSeconds: 1, 
  },
  sync: {
    defaultSyncIntervalInMinutes: DEBUG ? 1 / 6 : 5,
  },
  requests: {
    lowerBoundForFailedRequestTimeoutInSeconds: 5,
    upperBoundForFailedRequestTimeoutInSeconds: 10,
    maxNumberOfRequestAttempts: 3,
  },
  reddit: {
    timeoutUntilAnElementIsInViewportInMilliseconds: 125,
    behavior: {
      lowerLimitForUncertainInPercent: 60,
      lowerLimitForLikelyInPercent: 80,
    },
    interests: {
      maxNumberOfDisplayedInterests: 10,
    },
    activity: {
      maxFetchedPosts: 250,
    }
  },
}
