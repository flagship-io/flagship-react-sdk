import { IFlagshipConfig, LogLevel } from '@flagship.io/js-sdk'

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
