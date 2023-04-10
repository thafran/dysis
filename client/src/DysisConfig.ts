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
    lowerBoundForFailedRequestTimeoutInSeconds: 5,
    upperBoundForFailedRequestTimeoutInSeconds: 10,
    maxNumberOfRequestAttempts: 3,
  },
  reddit: {
    timeoutUntilAnElementIsInViewportInMilliseconds: 30,
    behavior: {
      lowerLimitForUncertainInPercent: 60,
      lowerLimitForLikelyInPercent: 80,
    },
    interests: {
      maxNumberOfDisplayedInterests: 5,
    },
    activity: {
      maxFetchedPosts: 300,
    }
  },
}
