import React from 'react'
import { jest, expect, it, describe, beforeEach, afterEach } from '@jest/globals'
import * as FsHooks from '../src/FlagshipHooks'
import { useFsModificationInfo, useFsModifications, useFsModification } from '../src/FlagshipHooks'
import { Mock } from 'jest-mock'
import { HitType, LogLevel, HitShape } from '@flagship.io/js-sdk'
import { Flag } from '../src/Flag'

describe('test FlagshipHooks', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let realUseContext:<T>(context: React.Context<T>)=> any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let useContextMock:Mock<any, [context: React.Context<any>]>
  // Setup mock
  beforeEach(() => {
    realUseContext = React.useContext
    useContextMock = jest.fn()
    React.useContext = useContextMock
  })
  // Cleanup mock
  afterEach(() => {
    React.useContext = realUseContext
  })

  it('useFsGetFlag test', async () => {
    const visitor = {
      getFlag: jest.fn()
    }
    const expected = {
      value: () => true
    }

    visitor.getFlag.mockReturnValue(expected)
    useContextMock.mockReturnValue({ state: { visitor } })

    const key = 'key'
    const defaultValue = 'default'
    const result = FsHooks.useFsFlag(key, defaultValue)
    expect(result).toEqual(expected)
    expect(visitor.getFlag).toBeCalledTimes(1)
    expect(visitor.getFlag).toBeCalledWith(key, defaultValue)
  })

  it('useFsGetFlag test sdk not ready', async () => {
    useContextMock.mockReturnValue({ state: { } })

    const key = 'key'
    const defaultValue = 'default'
    const result = FsHooks.useFsFlag(key, defaultValue)
    expect(result).toBeInstanceOf(Flag)
  })

  it('useFsModifications return default ', async () => {
    useContextMock.mockReturnValue({
      state: {
        status: {
          isSdkReady: true
        }
      }
    })
    const result = await useFsModification({ key: 'key', defaultValue: 'default' })
    expect(result).toBe('default')
  })

  it('useFsModification with initialModification', async () => {
    useContextMock.mockReturnValue({
      state: {
        status: {
          isSdkReady: false
        },
        modifications: new Map([['key', { value: 'value' }]])
      }
    })
    const result = await useFsModification({ key: 'key', defaultValue: 'default' })
    expect(result).toBe('value')
  })

  it('useFsModification modifications ', async () => {
    const visitor = {
      getModificationSync: jest.fn()
    }
    const expected = ['key1', 'key2']

    visitor.getModificationSync.mockReturnValue(expected)
    useContextMock.mockReturnValue({ state: { visitor } })
    const key = { key: 'key', defaultValue: 'default' }
    const result = await useFsModification(key)
    expect(result).toEqual(expected)
    expect(visitor.getModificationSync).toBeCalledTimes(1)
    expect(visitor.getModificationSync).toBeCalledWith(key)
  })

  it('useFsModifications return object of default ', async () => {
    useContextMock.mockReturnValue({
      state: {
        status: {
          isSdkReady: true
        }
      }
    })
    const keys = [{ key: 'key', defaultValue: 'default' }, { key: 'key1', defaultValue: 'default1' }]
    const result = await useFsModifications(keys)
    const flags:Record<string, unknown> = {}
    keys.forEach(item => {
      flags[item.key] = item.defaultValue
    })
    expect(result).toEqual(flags)
  })

  it('useFsModifications return object of default with initialModifications ', async () => {
    useContextMock.mockReturnValue({
      state: {
        status: {
          isSdkReady: false
        },
        modifications: new Map([['key2', { key: 'key', value: 'value1' }], ['key3', { key: 'key1', value: 'value2' }]])
      }
    })
    const keys = [{ key: 'key', defaultValue: 'default' }, { key: 'key1', defaultValue: 'default1' }]
    const result = await useFsModifications(keys)
    const flags:Record<string, unknown> = {}
    keys.forEach(item => {
      flags[item.key] = item.defaultValue
    })
    expect(result).toEqual(flags)
  })

  it('useFsModifications with initialModifications ', async () => {
    const state = {
      status: {
        isSdkReady: false
      },
      modifications: new Map([
        ['key', { key: 'key', value: 'value1' }],
        ['key1', { key: 'key1', value: 'value2' }],
        ['key2', { key: 'key2', value: { key: 2 } }],
        ['key3', { key: 'key3', value: [2, 2, 2] }]
      ])
    }
    useContextMock.mockReturnValue({
      state
    })

    const keys = [
      { key: 'key', defaultValue: 'default' },
      { key: 'key1', defaultValue: 'default1' },
      { key: 'key2', defaultValue: { key: 'a' } },
      { key: 'key3', defaultValue: [1, 1, 1] }
    ]

    const result = await useFsModifications<string|number[]|Record<string, string>>(keys)

    const flags:Record<string, unknown> = {}
    state.modifications.forEach(item => {
      flags[item.key] = item.value
    })
    expect(result).toEqual(flags)
  })

  it('useFsModifications modifications ', async () => {
    const visitor = {
      getModificationsSync: jest.fn()
    }
    const expected = ['key1', 'key2']

    visitor.getModificationsSync.mockReturnValue(expected)
    useContextMock.mockReturnValue({ state: { visitor } })
    const keys = [{ key: 'key', defaultValue: 'default' }, { key: 'key1', defaultValue: 'default1' }]
    const result = await useFsModifications(keys)
    expect(result).toEqual(expected)
    expect(visitor.getModificationsSync).toBeCalledTimes(1)
    expect(visitor.getModificationsSync).toBeCalledWith(keys, undefined)
  })

  it('useFsModificationInfo return null ', async () => {
    useContextMock.mockReturnValue({
      state: {
        status: {
          isSdkReady: true
        }
      }
    })

    const key = 'key'
    const result = await useFsModificationInfo(key)
    expect(result).toBeNull()
  })

  it('useFsModificationInfo return modification ', async () => {
    const visitor = {
      getModificationInfoSync: jest.fn()
    }

    useContextMock.mockReturnValue({ state: { visitor } })

    const expected = { key: 'key', campaignId: 'campaignId', variationGroupId: 'variationGroupId', variation: 'variation', isReference: true, value: 'value' }

    visitor.getModificationInfoSync.mockReturnValue(expected)

    const key = 'key'
    const result = await useFsModificationInfo(key)
    expect(result).toEqual(expected)
    expect(visitor.getModificationInfoSync).toBeCalledTimes(1)
    expect(visitor.getModificationInfoSync).toBeCalledWith(key)
  })

  it('useFsModificationInfo return modification with initialModification ', async () => {
    const expected = { key: 'key', campaignId: 'campaignId', variationGroupId: 'variationGroupId', variation: 'variation', isReference: true, value: 'value' }

    useContextMock.mockReturnValue({
      state: {
        status: {
          isSdkReady: false
        },
        modifications: new Map([
          ['key', expected]
        ])
      }
    })

    const key = 'key'
    const result = await useFsModificationInfo(key)
    expect(result).toEqual(expected)
  })

  it('useFsActivate ', async () => {
    const config = {
      logManager: {
        warning: jest.fn()
      },
      logLevel: LogLevel.ALL
    }
    useContextMock.mockReturnValue({ state: { config } })
    const key = 'Key'

    await FsHooks.useFsActivate([key])

    expect(config.logManager.warning).toBeCalledTimes(1)
  })

  it('useFsActivate ', async () => {
    const config = {
      logManager: {
        warning: jest.fn()
      },
      logLevel: LogLevel.ALL
    }
    const visitor = {
      activateModifications: jest.fn<Promise<void>, void[]>()
    }
    visitor.activateModifications.mockResolvedValue()
    useContextMock.mockReturnValue({ state: { config, visitor } })
    const key = ['Key']

    await FsHooks.useFsActivate(key)
    expect(visitor.activateModifications).toBeCalledTimes(1)
    expect(visitor.activateModifications).toBeCalledWith(key)
    expect(config.logManager.warning).toBeCalledTimes(0)
  })

  it('useFsActivate throw error ', async () => {
    const config = {
      logManager: {
        warning: jest.fn()
      },
      logLevel: LogLevel.ALL
    }
    const visitor = {
      activateModifications: jest.fn<Promise<void>, void[]>()
    }

    const error = 'error'
    visitor.activateModifications.mockRejectedValue(error)
    useContextMock.mockReturnValue({ state: { config, visitor } })
    const key = ['Key']

    await FsHooks.useFsActivate(key)
    expect(config.logManager.warning).toBeCalledTimes(1)
  })

  it('should ', async () => {
    const config = {
      logManager: {
        error: jest.fn(),
        warning: jest.fn()
      },
      logLevel: LogLevel.ALL
    }
    const visitor = {
      updateContext: jest.fn(),
      clearContext: jest.fn(),
      authenticate: jest.fn(),
      unauthenticate: jest.fn(),
      synchronizeModifications: jest.fn<Promise<void>, []>(),
      activateModifications: jest.fn<Promise<void>, []>(),
      modificationsAsync: jest.fn(),
      modifications: jest.fn(),
      getModificationsSync: jest.fn(),
      getModifications: jest.fn<Promise<unknown>, []>(),
      getModificationsArray: jest.fn(),
      getModificationInfo: jest.fn<Promise<unknown>, []>(),
      getModificationInfoSync: jest.fn(),
      getModificationSync: jest.fn(),
      sendHit: jest.fn(),
      sendHits: jest.fn(),
      getFlag: jest.fn(),
      fetchFlags: jest.fn(),
      getFlagsDataArray: jest.fn(),
      setConsent: jest.fn()
    }
    useContextMock.mockReturnValue({
      state: {
        config,
        status: {
          isSdkReady: true
        }
      }
    })

    let fs = FsHooks.useFlagship()

    const context = { key: 'context' }

    fs.updateContext(context)
    fs.clearContext()
    fs.hit.send({ type: HitType.PAGE, documentLocation: 'home' })
    fs.hit.sendMultiple([{ type: HitType.PAGE, documentLocation: 'home' }])
    fs.authenticate('visitor_id')
    fs.unauthenticate()
    expect(config.logManager.error).toBeCalledTimes(6)

    useContextMock.mockReturnValue({
      state: {
        config,
        visitor,
        status: {
          isSdkReady: true
        }
      }

    })

    fs = FsHooks.useFlagship()

    const flagKey = 'key'
    const flagDefaultValue = 'value'
    fs.getFlag(flagKey, flagDefaultValue)

    expect(visitor.getFlag).toBeCalledTimes(1)
    expect(visitor.getFlag).toBeCalledWith(flagKey, flagDefaultValue)

    fs.fetchFlags()
    expect(visitor.fetchFlags).toBeCalledTimes(1)

    fs.updateContext(context)

    expect(visitor.updateContext).toBeCalledTimes(1)
    expect(visitor.updateContext).toBeCalledWith(context)

    fs.clearContext()
    expect(visitor.clearContext).toBeCalledTimes(2)

    fs.setConsent(true)

    expect(visitor.setConsent).toBeCalledTimes(1)
    expect(visitor.setConsent).toBeCalledWith(true)

    const hit = { type: HitType.PAGE, documentLocation: 'home' }
    await fs.hit.send(hit)
    expect(visitor.sendHit).toBeCalledTimes(1)
    expect(visitor.sendHit).toBeCalledWith(hit)

    const hitShape: HitShape = {
      type: 'Event',
      data: {
        action: 'test',
        category: 'Action Tracking'
      }
    }
    await fs.hit.send(hitShape)
    expect(visitor.sendHit).toBeCalledTimes(2)
    expect(visitor.sendHit).toBeCalledWith(hitShape)

    await fs.hit.sendMultiple([hit])
    expect(visitor.sendHits).toBeCalledTimes(1)
    expect(visitor.sendHits).toBeCalledWith([hit])

    const visitorId = 'visitor_id'
    fs.authenticate(visitorId)

    expect(visitor.authenticate).toBeCalledTimes(1)
    expect(visitor.authenticate).toBeCalledWith(visitorId)

    fs.unauthenticate()

    expect(visitor.unauthenticate).toBeCalledTimes(1)

    visitor.activateModifications.mockResolvedValue()

    fs.activateModification(['key']).then(() => {
      expect(visitor.activateModifications).toBeCalledTimes(1)
    }).catch(error => {
      console.log(error)
    })

    visitor.synchronizeModifications.mockResolvedValue()

    fs.synchronizeModifications().then(() => {
      expect(visitor.synchronizeModifications).toBeCalledTimes(1)
    }).catch(error => {
      console.log(error)
    })

    visitor.getModificationsSync.mockReturnValue({})

    const modification = fs.getModifications([{ key: 'key', defaultValue: 'value' }])
    expect(modification).toEqual({})
    expect(visitor.getModificationsSync).toBeCalledTimes(1)

    const value = fs.getModifications([{ key: 'key', defaultValue: 'value' }])
    expect(visitor.getModificationsSync).toBeCalledTimes(2)
    expect(value).toEqual({})

    visitor.getModificationInfoSync.mockReturnValue({})
    fs.getModificationInfo('key')
    expect(visitor.getModificationInfoSync).toBeCalledTimes(1)
    expect(visitor.getModificationInfoSync).toBeCalledWith('key')

    const expected = { key: 'key', campaignId: 'campaignId', variationGroupId: 'variationGroupId', variation: 'variation', isReference: true, value: 'value' }
    useContextMock.mockReturnValue({
      state: {
        config,
        status: {
          isSdkReady: false
        },
        modifications: new Map([
          ['key', expected]
        ])
      }
    })
    fs = FsHooks.useFlagship()
    expect(fs.modifications).toEqual([expected])

    //
    fs.getFlag(flagKey, flagDefaultValue)

    fs.fetchFlags()
    expect(config.logManager.warning).toBeCalledTimes(1)
  })
})
