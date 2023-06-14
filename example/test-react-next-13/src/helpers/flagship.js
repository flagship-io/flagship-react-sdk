import { Flagship, DecisionMode } from '@flagship.io/react-sdk'
import { ENV_ID, API_KEY } from '../config.js'

export async function getFsVisitorData () {
  if (!Flagship.getVisitor()) {
    Flagship.start(
      ENV_ID,
      API_KEY,
      {
        // decisionMode: DecisionMode.BUCKETING,
        fetchThirdPartyData: true,
        trackingMangerConfig:{
          cacheStrategy: 3
        },
        fetchNow: false,
        pollingInterval: 30,
        nextFetchConfig:{ revalidate: 5 }
      }
    )
  }

  const visitor = Flagship.newVisitor({
    visitorId: null,
    context: {},
    isNewInstance: false
  })
  await visitor.fetchFlags()

  return visitor
}
