const DEBUG = false;

export const dysisConfig = {
  server: {
    baseUrl: DEBUG ? 'http://localhost:8080/' : 'https://reddit-insight.herokuapp.com/'
  },
  tracking: {
    defaultMaxIdleTimeInSeconds: 40,
    defaultTrackingIntervalInSeconds: 1, 
  },
  sync: {
    defaultSyncIntervalInMinutes: DEBUG ? 1 / 6 : 2,
  },
  requests: {
    lowerBoundForFailedRequestTimeoutInSeconds: 1, //5
    upperBoundForFailedRequestTimeoutInSeconds: 3, //10
    maxNumberOfRequestAttempts: 2, //3
  },
  reddit: {
    timeoutUntilAnElementIsInViewportInMilliseconds: 100, //80
    behavior: {
      lowerLimitForUncertainInPercent: 60,
      lowerLimitForLikelyInPercent: 80,
    },
    interests: {
      maxNumberOfDisplayedInterests: 5,
    },
    activity: {
      maxFetchedPosts: 150,
    }
  },
}
