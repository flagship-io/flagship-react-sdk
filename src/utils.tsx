'use client'
import {
  CampaignDTO,
  FlagDTO,
  IFlagshipConfig,
  LogLevel
} from '@flagship.io/js-sdk'
import { EffectCallback, DependencyList, useEffect, useRef } from 'react'

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
