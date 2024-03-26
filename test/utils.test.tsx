import { jest, expect, it, describe } from '@jest/globals'
import {
  getFlagsFromCampaigns,
  hasSameType,
  logError,
  logInfo,
  logWarn,
  sprintf,
  uuidV4
} from '../src/utils'
import { IFlagshipLogManager } from '@flagship.io/js-sdk/dist/utils/FlagshipLogManager'
import { DecisionApiConfig, LogLevel } from '@flagship.io/js-sdk'
import { campaigns } from './campaigns'

describe('test logError function', () => {
  const config = new DecisionApiConfig()

  const logManager = {} as IFlagshipLogManager

  const onLog = jest.fn<(level: LogLevel, tag: string, message: string) => void>()

  const errorMethod = jest.fn<()=>void>()

  config.onLog = onLog

  logManager.error = errorMethod

  config.logManager = logManager

  const messageAll = 'this is a log message'
  const tag = 'tag'

  it('test logError level ALL', () => {
    logError(config, messageAll, tag)
    expect(errorMethod).toBeCalledTimes(1)
    expect(errorMethod).toBeCalledWith(messageAll, tag)
    expect(onLog).toBeCalledTimes(1)
    expect(onLog).toBeCalledWith(LogLevel.ERROR, tag, messageAll)
  })

  it('test level EMERGENCY', () => {
    config.logLevel = LogLevel.EMERGENCY
    const messageEmergency = 'emergency'
    logError(config, messageEmergency, tag)
    expect(errorMethod).toBeCalledTimes(0)
    expect(onLog).toBeCalledTimes(0)
  })

  it('test level NONE', () => {
    config.logLevel = LogLevel.NONE
    const messageNone = 'none'
    logError(config, messageNone, tag)
    expect(errorMethod).toBeCalledTimes(0)
    expect(onLog).toBeCalledTimes(0)
  })

  it('test level INFO', () => {
    config.logLevel = LogLevel.INFO
    const messageInfo = 'this a message with info level'
    logError(config, messageInfo, tag)
    expect(errorMethod).toBeCalledTimes(1)
    expect(errorMethod).toBeCalledWith(messageInfo, tag)
    expect(onLog).toBeCalledTimes(1)
    expect(onLog).toBeCalledWith(LogLevel.ERROR, tag, messageInfo)
  })

  it('test invalid config', () => {
    logError({} as DecisionApiConfig, messageAll, tag)
    expect(errorMethod).toBeCalledTimes(0)
  })
})

describe('test logInfo function', () => {
  const config = new DecisionApiConfig()

  const logManager = {} as IFlagshipLogManager

  const infoMethod = jest.fn<()=>void>()

  logManager.info = infoMethod

  const onLog = jest.fn<(level: LogLevel, tag: string, message: string) => void>()

  config.onLog = onLog

  config.logManager = logManager

  const messageAll = 'this is a log message'
  const tag = 'tag'

  it('test logError level ALL', () => {
    logInfo(config, messageAll, tag)
    expect(infoMethod).toBeCalledTimes(1)
    expect(infoMethod).toBeCalledWith(messageAll, tag)
    expect(onLog).toBeCalledTimes(1)
    expect(onLog).toBeCalledWith(LogLevel.INFO, tag, messageAll)
  })

  it('test level EMERGENCY', () => {
    config.logLevel = LogLevel.EMERGENCY
    const messageEmergency = 'emergency'
    logInfo(config, messageEmergency, tag)
    expect(infoMethod).toBeCalledTimes(0)
    expect(onLog).toBeCalledTimes(0)
  })

  it('test level NONE', () => {
    config.logLevel = LogLevel.NONE
    const messageNone = 'none'
    logInfo(config, messageNone, tag)
    expect(infoMethod).toBeCalledTimes(0)
    expect(onLog).toBeCalledTimes(0)
  })

  it('test level INFO', () => {
    config.logLevel = LogLevel.INFO
    const messageInfo = 'this a message with info level'
    logInfo(config, messageInfo, tag)
    expect(infoMethod).toBeCalledTimes(1)
    expect(infoMethod).toBeCalledWith(messageInfo, tag)
    expect(onLog).toBeCalledTimes(1)
    expect(onLog).toBeCalledWith(LogLevel.INFO, tag, messageInfo)
  })

  it('test invalid config', () => {
    logInfo({} as DecisionApiConfig, messageAll, tag)
    expect(infoMethod).toBeCalledTimes(0)
  })
})

describe('test logWarn function', () => {
  const config = new DecisionApiConfig()

  const logManager = {} as IFlagshipLogManager

  const warnMethod = jest.fn<()=>void>()

  logManager.warning = warnMethod

  config.logManager = logManager

  const onLog = jest.fn<(level: LogLevel, tag: string, message: string) => void>()

  config.onLog = onLog

  const messageAll = 'this is a log message'
  const tag = 'tag'

  it('test logError level ALL', () => {
    logWarn(config, messageAll, tag)
    expect(warnMethod).toBeCalledTimes(1)
    expect(warnMethod).toBeCalledWith(messageAll, tag)
    expect(onLog).toBeCalledTimes(1)
    expect(onLog).toBeCalledWith(LogLevel.WARNING, tag, messageAll)
  })

  it('test level EMERGENCY', () => {
    config.logLevel = LogLevel.EMERGENCY
    const messageEmergency = 'emergency'
    logWarn(config, messageEmergency, tag)
    expect(warnMethod).toBeCalledTimes(0)
    expect(onLog).toBeCalledTimes(0)
  })

  it('test level NONE', () => {
    config.logLevel = LogLevel.NONE
    const messageNone = 'none'
    logWarn(config, messageNone, tag)
    expect(warnMethod).toBeCalledTimes(0)
    expect(onLog).toBeCalledTimes(0)
  })

  it('test level WARNING', () => {
    config.logLevel = LogLevel.WARNING
    const messageInfo = 'this a message with info level'
    logWarn(config, messageInfo, tag)
    expect(warnMethod).toBeCalledTimes(1)
    expect(warnMethod).toBeCalledWith(messageInfo, tag)
    expect(onLog).toBeCalledTimes(1)
    expect(onLog).toBeCalledWith(LogLevel.WARNING, tag, messageInfo)
  })

  it('test invalid config', () => {
    logWarn({} as DecisionApiConfig, messageAll, tag)
    expect(warnMethod).toBeCalledTimes(0)
  })
})

describe('test getModificationsFromCampaigns', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getNull = (): any => null
  it('should ', () => {
    const modifications = getFlagsFromCampaigns(getNull())
    expect(modifications).toBeInstanceOf(Map)
    expect(modifications.size).toBe(0)
  })
  it('should ', () => {
    const modifications = getFlagsFromCampaigns(campaigns)
    expect(modifications).toBeInstanceOf(Map)
    expect(modifications.size).toBe(6)
    expect(modifications.get('btnColor')?.value).toEqual('blue')
    expect(modifications.get('keyNumber')?.value).toEqual(558)
  })
})

describe('test uuidV4', () => {
  it('should ', () => {
    const id = uuidV4()
    expect(id).toBeDefined()
    expect(id.length).toBe(36)
  })
})

describe('test sprintf function', () => {
  it('should ', () => {
    const textToTest = 'My name is {0} {1}'
    const output = sprintf(textToTest, 'merveille', 'kitoko')
    expect(output).toBe('My name is merveille kitoko')
  })
})

describe('test hasSameType function', () => {
  it('should ', () => {
    let output = hasSameType('value1', 'value2')
    expect(output).toBeTruthy()

    output = hasSameType(1, 'value2')
    expect(output).toBeFalsy()

    output = hasSameType([1, 2], [1, 5])
    expect(output).toBeTruthy()

    output = hasSameType({}, { key: 'value' })
    expect(output).toBeTruthy()

    output = hasSameType([1, 2], {})
    expect(output).toBeFalsy()
  })
})
