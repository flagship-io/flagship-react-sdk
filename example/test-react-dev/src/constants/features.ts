export const V1 = {
  env: true,
  visitor: true,
  updateContext: true,
  flagValue: true,
  flagActivate: true,
  flagInfo: true,
  hits: true,
  logs: true,
}

export const V2 = {
  bucketing: true,
  pollingInterval: true,
  pollingIntervalUnit: true,
  experienceContinuity: true
}

export const V3 = {
  ...V1,
  ...V2,
  flagValue: false,
  flagActivate: false,
  flagInfo: false,
  
  consent: true,
  flagValue3: true,
  flagActivate3: true,
  flagInfo3: true,
}

export const featureFlagsAll = {
  ...V1,
  ...V2,
  ...V3
}
