export const V1 = {
  env: true,
  visitor: true,
  updateContext: true,
  flagValue: true,
  flagActivate: true,
  flagInfo: true,
  hits: true,
  logs: true
}

export const V2 = {
  bucketing: true,
  pollingInterval: true,
  pollingIntervalUnit: true,
  experienceContinuity: true
}

export const V3 = {
  consent: true
}

export const featureFlagsAll = {
  ...V1,
  ...V2,
  ...V3
}
