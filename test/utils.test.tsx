import { jest, expect, it, describe } from '@jest/globals'

import { DecisionApiConfig, LogLevel, IFlagshipLogManager, SerializedFlagMetadata, FlagDTO, CampaignDTO } from '@flagship.io/js-sdk'

import {
  extractFlagsMap,
  getFlagsFromCampaigns,
  hasSameType,
  hexToValue,
  logError,
  logInfo,
  logWarn,
  sprintf,
  uuidV4
} from '../src/utils'
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

describe('Test hexToValue function', () => {
  const config = new DecisionApiConfig()

  const logManager = {
    error: jest.fn<() => void>()
  } as unknown as IFlagshipLogManager

  const errorMethod = jest.spyOn(logManager, 'error')

  config.logManager = logManager

  it('should return null for invalid hex string', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = hexToValue(true as any, config)
    expect(result).toBeNull()
    expect(errorMethod).toBeCalledTimes(1)
  })

  it('should return null for hex string with invalid characters', () => {
    const result = hexToValue('zz', config)
    expect(result).toBeNull()
    expect(errorMethod).toBeCalledTimes(1)
  })

  it('should return parsed value for valid hex string', () => {
    const hex = Buffer.from(JSON.stringify({ v: 'test' })).toString('hex')
    const result = hexToValue(hex, config)
    expect(result).toEqual({ v: 'test' })
  })

  it('should return null for hex string that does not represent valid JSON', () => {
    const hex = Buffer.from('invalid').toString('hex')
    const result = hexToValue(hex, config)
    expect(result).toBeNull()
    expect(errorMethod).toBeCalledTimes(1)
  })
})

describe('extractFlagsMap', () => {
  it('should correctly extract flags from initialFlagsData', () => {
    const initialFlagsData: SerializedFlagMetadata[] = [
      {
        key: 'key1',
        campaignId: 'campaignId',
        campaignName: 'campaignName',
        campaignType: 'ab',
        variationGroupId: 'ab',
        variationGroupName: 'variationGroupName',
        variationId: 'varId',
        variationName: 'variationName',
        slug: 'slug',
        hex: '7b2276223a2274657374227d'
      },
      {
        key: 'key2',
        campaignId: 'campaignId',
        campaignName: 'campaignName',
        campaignType: 'ab',
        variationGroupId: 'ab',
        variationGroupName: 'variationGroupName',
        variationId: 'varId',
        variationName: 'variationName',
        slug: 'slug',
        hex: '7b2276223a2274657374227d'
      }
    ]

    const result = extractFlagsMap(initialFlagsData)
    // Add your expected result here
    const expectedResult = new Map<string, FlagDTO>()
    expectedResult.set('key1', {
      key: 'key1',
      campaignId: 'campaignId',
      campaignName: 'campaignName',
      campaignType: 'ab',
      variationGroupId: 'ab',
      variationGroupName: 'variationGroupName',
      variationId: 'varId',
      variationName: 'variationName',
      slug: 'slug',
      value: 'test'
    })
    expectedResult.set('key2', {
      key: 'key2',
      campaignId: 'campaignId',
      campaignName: 'campaignName',
      campaignType: 'ab',
      variationGroupId: 'ab',
      variationGroupName: 'variationGroupName',
      variationId: 'varId',
      variationName: 'variationName',
      slug: 'slug',
      value: 'test'
    })

    expect(result).toEqual(expectedResult)
  })

  it('should correctly extract flags from initialCampaigns when initialFlagsData is not an array', () => {
    const initialCampaigns: CampaignDTO[] = [
      {
        id: 'campaignId',
        name: 'campaignName',
        variationGroupId: 'ab',
        variationGroupName: 'variationGroupName',
        slug: 'slug',
        variation: {
          id: 'varId',
          name: 'variationName',
          reference: false,
          modifications: {
            type: 'JSON',
            value: { key1: 'test' }
          }
        }
      },
      {
        id: 'campaignId',
        name: 'campaignName',
        variationGroupId: 'ab',
        variationGroupName: 'variationGroupName',
        slug: 'slug',
        variation: {
          id: 'varId',
          name: 'variationName',
          reference: false,
          modifications: {
            type: 'JSON',
            value: { key2: 'test' }
          }
        }
      }
    ]

    const result = extractFlagsMap(undefined, initialCampaigns)
    // Add your expected result here
    const expectedResult = new Map<string, FlagDTO>()
    expectedResult.set('key1', {
      key: 'key1',
      campaignId: 'campaignId',
      campaignName: 'campaignName',
      variationGroupId: 'ab',
      variationGroupName: 'variationGroupName',
      variationId: 'varId',
      variationName: 'variationName',
      slug: 'slug',
      value: 'test',
      isReference: false
    })
    expectedResult.set('key2', {
      key: 'key2',
      campaignId: 'campaignId',
      campaignName: 'campaignName',
      variationGroupId: 'ab',
      variationGroupName: 'variationGroupName',
      variationId: 'varId',
      variationName: 'variationName',
      slug: 'slug',
      value: 'test',
      isReference: false
    })

    expect(result).toEqual(expectedResult)
  })
})
