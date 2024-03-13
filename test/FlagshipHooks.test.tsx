import React from 'react'
import { jest, expect, it, describe, beforeEach, afterEach } from '@jest/globals'
import * as FsHooks from '../src/FlagshipHooks'
import { Mock } from 'jest-mock'
import Flagship, { HitType, LogLevel } from '@flagship.io/js-sdk'
import { Flag } from '../src/Flag'

describe('test FlagshipHooks', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let realUseContext:<T>(context: React.Context<T>)=> any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let useContextMock:Mock<(context: React.Context<any>)=> any>
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

  it('useFsModifications with useFsFlag ', async () => {
    const state = {
      status: {
        isSdkReady: false
      },
      flags: new Map([
        ['key', { key: 'key', value: 'value1' }],
        ['key1', { key: 'key1', value: 'value2' }],
        ['key2', { key: 'key2', value: { key: 2 } }],
        ['key3', { key: 'key3', value: [2, 2, 2] }]
      ])
    }
    useContextMock.mockReturnValue({
      state
    })

    const result = FsHooks.useFsFlag('key', 'default')

    expect(result.getValue()).toEqual('value1')
  })

  it('should test FlagshipHooks', async () => {
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

    Flagship.close = jest.fn<()=>Promise<void>>()

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

    await fs.hit.sendMultiple([hit])
    expect(visitor.sendHits).toBeCalledTimes(1)
    expect(visitor.sendHits).toBeCalledWith([hit])

    const visitorId = 'visitor_id'
    fs.authenticate(visitorId)

    expect(visitor.authenticate).toBeCalledTimes(1)
    expect(visitor.authenticate).toBeCalledWith(visitorId)

    fs.unauthenticate()

    expect(visitor.unauthenticate).toBeCalledTimes(1)

    await fs.close()
    expect(Flagship.close).toBeCalledTimes(1)
  })

  it('test without visitor', () => {
    const config = {
      logManager: {
        error: jest.fn(),
        warning: jest.fn()
      },
      logLevel: LogLevel.ALL
    }
    const expected = { key: 'key', campaignId: 'campaignId', variationGroupId: 'variationGroupId', variation: 'variation', isReference: true, value: 'value' }

    useContextMock.mockReturnValue({
      state: {
        config,
        status: {
          isSdkReady: false
        },
        flags: new Map([
          ['key', expected]
        ])
      }
    })
    const fs = FsHooks.useFlagship()
    expect(fs.flagsData).toEqual([expected])

    const flagKey = 'key'
    const flagDefaultValue = 'value'
    //
    const flag = fs.getFlag(flagKey, flagDefaultValue)

    expect(flag).toBeDefined()
    expect(flag.getValue()).toEqual(flagDefaultValue)

    fs.fetchFlags()
    expect(config.logManager.warning).toBeCalledTimes(1)

    fs.setConsent(true)

    expect(config.logManager.warning).toBeCalledTimes(2)
  })
})
