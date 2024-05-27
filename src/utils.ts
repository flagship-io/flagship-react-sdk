'use client'
import { EffectCallback, DependencyList, useEffect, useRef } from 'react'

import Flagship, {
  CampaignDTO,
  FlagDTO,
  IFlagshipConfig,
  LogLevel,
  SerializedFlagMetadata
} from '@flagship.io/js-sdk'

export function logError (
  config: IFlagshipConfig | undefined,
  message: string,
  tag: string
): void {
  if (!config || !config.logLevel || config.logLevel < LogLevel.ERROR) {
    return
  }

  if (typeof config.onLog === 'function') {
    config.onLog(LogLevel.ERROR, tag, message)
  }

  if (config.logManager && typeof config.logManager.error === 'function') {
    config.logManager.error(message, tag)
  }
}

export function logInfo (
  config: IFlagshipConfig | undefined,
  message: string,
  tag: string
): void {
  if (!config || !config.logLevel || config.logLevel < LogLevel.INFO) {
    return
  }

  if (typeof config.onLog === 'function') {
    config.onLog(LogLevel.INFO, tag, message)
  }

  if (config.logManager && typeof config.logManager.info === 'function') {
    config.logManager.info(message, tag)
  }
}

export function logWarn (
  config: IFlagshipConfig | undefined,
  message: string,
  tag: string
): void {
  if (!config || !config.logLevel || config.logLevel < LogLevel.WARNING) {
    return
  }

  if (typeof config.onLog === 'function') {
    config.onLog(LogLevel.WARNING, tag, message)
  }

  if (config.logManager && typeof config.logManager.warning === 'function') {
    config.logManager.warning(message, tag)
  }
}

export const getFlagsFromCampaigns = (
  campaigns: Array<CampaignDTO>
): Map<string, FlagDTO> => {
  const flags = new Map<string, FlagDTO>()
  if (!campaigns || !Array.isArray(campaigns)) {
    return flags
  }
  campaigns.forEach((campaign) => {
    const object = campaign.variation.modifications.value
    for (const key in object) {
      const value = object[key]
      flags.set(key, {
        key,
        campaignId: campaign.id,
        campaignName: campaign.name || '',
        variationGroupId: campaign.variationGroupId,
        variationGroupName: campaign.variationGroupName || '',
        variationId: campaign.variation.id,
        variationName: campaign.variation.name || '',
        isReference: campaign.variation.reference,
        value
      })
    }
  })
  return flags
}

export function uuidV4 (): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
    /[xy]/g,
    function (char) {
      const rand = (Math.random() * 16) | 0
      const value = char === 'x' ? rand : (rand & 0x3) | 0x8
      return value.toString(16)
    }
  )
}

export function useNonInitialEffect (
  effect: EffectCallback,
  deps?: DependencyList
): void {
  const initialRender = useRef(true)

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false
      return
    }

    if (typeof effect === 'function') {
      return effect()
    }
  }, deps)
}

export function hasSameType (flagValue:unknown, defaultValue:unknown):boolean {
  if (typeof flagValue !== typeof defaultValue) {
    return false
  }
  if (typeof flagValue === 'object' && typeof defaultValue === 'object' &&
  Array.isArray(flagValue) !== Array.isArray(defaultValue)
  ) {
    return false
  }
  return true
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function sprintf (format: string, ...value: any[]): string {
  let formatted = format
  for (let i = 0; i < value.length; i++) {
    const element = value[i]
    formatted = formatted.replace(new RegExp(`\\{${i}\\}`, 'g'), element)
  }
  return formatted
}

export function hexToValue (hex: string, config: IFlagshipConfig): {v: unknown} | null {
  if (typeof hex !== 'string') {
    logError(config, `Invalid hex string: ${hex}`, 'hexToValue')
    return null
  }

  let jsonString = ''

  for (let i = 0; i < hex.length; i += 2) {
    const hexChar = hex.slice(i, i + 2)
    const charCode = parseInt(hexChar, 16)

    if (isNaN(charCode)) {
      logError(config, `Invalid hex character: ${hexChar}`, 'hexToValue')
      return null
    }

    jsonString += String.fromCharCode(charCode)
  }

  try {
    const value: {v: unknown} = JSON.parse(jsonString)
    return value
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error:any) {
    logError(config, `Error while parsing JSON: ${error?.message}`, 'hexToValue')
    return null
  }
}

export function extractFlagsMap (initialFlagsData?: SerializedFlagMetadata[], initialCampaigns?:CampaignDTO[]): Map<string, FlagDTO> {
  let flags = new Map<string, FlagDTO>()

  if (Array.isArray(initialFlagsData)) {
    initialFlagsData.forEach((flag) => {
      flags.set(flag.key, {
        key: flag.key,
        campaignId: flag.campaignId,
        campaignName: flag.campaignName,
        variationGroupId: flag.variationGroupId,
        variationGroupName: flag.variationGroupName,
        variationId: flag.variationId,
        variationName: flag.variationName,
        isReference: flag.isReference,
        campaignType: flag.campaignType,
        slug: flag.slug,
        value: hexToValue(flag.hex, Flagship.getConfig())?.v
      })
    })
  } else if (initialCampaigns) {
    flags = getFlagsFromCampaigns(initialCampaigns)
  }

  return flags
}
