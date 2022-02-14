import { CampaignDTO, IFlagshipConfig, LogLevel, Modification } from '@flagship.io/js-sdk'

export function logError (
  config: IFlagshipConfig|undefined,
  message: string,
  tag: string
):void {
  if (
    !config ||
        !config.logManager ||
        typeof config.logManager.error !== 'function' ||
        !config.logLevel ||
        config.logLevel < LogLevel.ERROR
  ) {
    return
  }

  config.logManager.error(message, tag)
}

export function logInfo (config: IFlagshipConfig|undefined, message: string, tag: string):void {
  if (
    !config ||
        !config.logManager ||
        typeof config.logManager.info !== 'function' ||
        !config.logLevel ||
        config.logLevel < LogLevel.INFO
  ) {
    return
  }
  config.logManager.info(message, tag)
}

export function logWarn (config: IFlagshipConfig|undefined, message: string, tag: string):void {
  if (
    !config || !config.logManager ||
      typeof config.logManager.warning !== 'function' || !config.logLevel || config.logLevel < LogLevel.WARNING
  ) {
    return
  }
  config.logManager.warning(message, tag)
}

export function log (level: LogLevel, message: string, tag: string): void {
  const now = new Date()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getTwoDigit = (value: any) => {
    return value.toString().length === 1 ? `0${value}` : value
  }

  const out = `[${getTwoDigit(now.getFullYear())}-${
    getTwoDigit(
      now.getMonth()
    )
  }-${getTwoDigit(now.getDay())} ${
    getTwoDigit(
      now.getHours()
    )
  }:${getTwoDigit(now.getMinutes())}] [Flagship SDK] [${
    LogLevel[level]
  }] [${tag}] : ${message}`
  console.log(out)
}

export const getModificationsFromCampaigns = (campaigns: Array<CampaignDTO>):Map<string, Modification> => {
  const modifications = new Map<string, Modification>()
  if (!campaigns || !Array.isArray(campaigns)) {
    return modifications
  }
  campaigns.forEach((campaign) => {
    const object = campaign.variation.modifications.value
    for (const key in object) {
      const value = object[key]
      modifications.set(
        key,
        {
          key,
          campaignId: campaign.id,
          variationGroupId: campaign.variationGroupId,
          variationId: campaign.variation.id,
          isReference: campaign.variation.reference,
          value
        }
      )
    }
  })
  return modifications
}

export function uuidV4 ():string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (char) {
    const rand = Math.random() * 16 | 0
    const value = char === 'x' ? rand : (rand & 0x3 | 0x8)
    return value.toString(16)
  })
}
