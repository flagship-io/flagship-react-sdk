import { jest, expect, it, describe } from '@jest/globals'
import { getModificationsFromCampaigns, logError, logInfo, logWarn } from '../src/utils'
import { Mock } from 'jest-mock'
import { IFlagshipLogManager } from '@flagship.io/js-sdk/dist/utils/FlagshipLogManager'
import { DecisionApiConfig, LogLevel } from '@flagship.io/js-sdk'
import { campaigns } from './campaigns'

describe('test logError function', () => {
  const config = new DecisionApiConfig()

  const logManager = {} as IFlagshipLogManager

  const errorMethod:Mock<void, []> = jest.fn()

  logManager.error = errorMethod

  config.logManager = logManager

  const messageAll = 'this is a log message'
  const tag = 'tag'

  it('test logError level ALL', () => {
    logError(config, messageAll, tag)
    expect(errorMethod).toBeCalledTimes(1)
    expect(errorMethod).toBeCalledWith(messageAll, tag)
  })

  it('test level EMERGENCY', () => {
    config.logLevel = LogLevel.EMERGENCY
    const messageEmergency = 'emergency'
    logError(config, messageEmergency, tag)
    expect(errorMethod).toBeCalledTimes(0)
  })

  it('test level NONE', () => {
    config.logLevel = LogLevel.NONE
    const messageNone = 'none'
    logError(config, messageNone, tag)
    expect(errorMethod).toBeCalledTimes(0)
  })

  it('test level INFO', () => {
    config.logLevel = LogLevel.INFO
    const messageInfo = 'this a message with info level'
    logError(config, messageInfo, tag)
    expect(errorMethod).toBeCalledTimes(1)
    expect(errorMethod).toBeCalledWith(messageInfo, tag)
  })

  it('test invalid config', () => {
    logError({} as DecisionApiConfig, messageAll, tag)
    expect(errorMethod).toBeCalledTimes(0)
  })
})

describe('test logInfo function', () => {
  const config = new DecisionApiConfig()

  const logManager = {} as IFlagshipLogManager

  const infoMethod:Mock<void, []> = jest.fn()

  logManager.info = infoMethod

  config.logManager = logManager

  const messageAll = 'this is a log message'
  const tag = 'tag'

  it('test logError level ALL', () => {
    logInfo(config, messageAll, tag)
    expect(infoMethod).toBeCalledTimes(1)
    expect(infoMethod).toBeCalledWith(messageAll, tag)
  })

  it('test level EMERGENCY', () => {
    config.logLevel = LogLevel.EMERGENCY
    const messageEmergency = 'emergency'
    logInfo(config, messageEmergency, tag)
    expect(infoMethod).toBeCalledTimes(0)
  })

  it('test level NONE', () => {
    config.logLevel = LogLevel.NONE
    const messageNone = 'none'
    logInfo(config, messageNone, tag)
    expect(infoMethod).toBeCalledTimes(0)
  })

  it('test level INFO', () => {
    config.logLevel = LogLevel.INFO
    const messageInfo = 'this a message with info level'
    logInfo(config, messageInfo, tag)
    expect(infoMethod).toBeCalledTimes(1)
    expect(infoMethod).toBeCalledWith(messageInfo, tag)
  })

  it('test invalid config', () => {
    logInfo({} as DecisionApiConfig, messageAll, tag)
    expect(infoMethod).toBeCalledTimes(0)
  })
})

describe('test logWarn function', () => {
  const config = new DecisionApiConfig()

  const logManager = {} as IFlagshipLogManager

  const warnMethod:Mock<void, []> = jest.fn()

  logManager.warning = warnMethod

  config.logManager = logManager

  const messageAll = 'this is a log message'
  const tag = 'tag'

  it('test logError level ALL', () => {
    logWarn(config, messageAll, tag)
    expect(warnMethod).toBeCalledTimes(1)
    expect(warnMethod).toBeCalledWith(messageAll, tag)
  })

  it('test level EMERGENCY', () => {
    config.logLevel = LogLevel.EMERGENCY
    const messageEmergency = 'emergency'
    logWarn(config, messageEmergency, tag)
    expect(warnMethod).toBeCalledTimes(0)
  })

  it('test level NONE', () => {
    config.logLevel = LogLevel.NONE
    const messageNone = 'none'
    logWarn(config, messageNone, tag)
    expect(warnMethod).toBeCalledTimes(0)
  })

  it('test level WARNING', () => {
    config.logLevel = LogLevel.WARNING
    const messageInfo = 'this a message with info level'
    logWarn(config, messageInfo, tag)
    expect(warnMethod).toBeCalledTimes(1)
    expect(warnMethod).toBeCalledWith(messageInfo, tag)
  })

  it('test invalid config', () => {
    logWarn({} as DecisionApiConfig, messageAll, tag)
    expect(warnMethod).toBeCalledTimes(0)
  })
})

describe('test getModificationsFromCampaigns', () => {
  const getNull = ():any => null
  it('should ', () => {
    const modifications = getModificationsFromCampaigns(getNull())
    expect(modifications).toBeInstanceOf(Map)
    expect(modifications.size).toBe(0)
  })
  it('should ', () => {
    const modifications = getModificationsFromCampaigns(campaigns)
    expect(modifications).toBeInstanceOf(Map)
    expect(modifications.size).toBe(6)
    expect(modifications.get('btnColor')?.value).toEqual('blue')
    expect(modifications.get('keyNumber')?.value).toEqual(558)
  })
})
