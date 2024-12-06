import React from 'react'

import { jest, expect, it, describe, beforeEach, afterEach } from '@jest/globals'
import { renderHook } from '@testing-library/react-hooks'
import { Mock } from 'jest-mock'

import Flagship, { FSFlagCollection, HitType, LogLevel, primitive } from '@flagship.io/js-sdk'

import * as FsHooks from '../src/FlagshipHooks'
import { FSFlag } from '../src/FSFlag'

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
    const { result } = renderHook(() => FsHooks.useFsFlag(key))
    expect(result.current).toEqual(expected)
    expect(visitor.getFlag).toBeCalledTimes(1)
    expect(visitor.getFlag).toBeCalledWith(key)
  })

  it('useFsGetFlag test sdk not ready', async () => {
    useContextMock.mockReturnValue({ state: { } })

    const key = 'key'
    const { result } = renderHook(() => FsHooks.useFsFlag(key))
    expect(result.current).toBeInstanceOf(FSFlag)
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

    const { result } = renderHook(() => FsHooks.useFsFlag('key'))

    expect(result.current.getValue('default')).toEqual('value1')
  })

  it('should test FlagshipHooks', async () => {
    const config = {
      logManager: {
        error: jest.fn(),
        warning: jest.fn()
      },
      logLevel: LogLevel.ALL
    }

    function updateContext (context: Record<string, primitive>) {
      visitor.context = { ...visitor.context, ...context }
    }

    function clearContext () {
      visitor.context = {}
    }

    function authenticate (visitorId: string) {
      visitor.anonymousId = visitor.visitorId
      visitor.visitorId = visitorId
    }

    function unauthenticate () {
      visitor.visitorId = visitor.anonymousId
      visitor.anonymousId = ''
    }

    const visitor = {
      anonymousId: '',
      visitorId: 'AnonymousVisitorId',
      updateContext: jest.fn<typeof updateContext>(),
      clearContext: jest.fn<typeof clearContext>(),
      authenticate: jest.fn<typeof authenticate>(),
      unauthenticate: jest.fn<typeof unauthenticate>(),
      sendHit: jest.fn(),
      sendHits: jest.fn(),
      getFlag: jest.fn(),
      getFlags: jest.fn(),
      fetchFlags: jest.fn(),
      getFlagsDataArray: jest.fn(),
      setConsent: jest.fn(),
      collectEAIDataAsync: jest.fn<()=> Promise<void>>(),
      context: {}
    }

    visitor.updateContext.mockImplementation(updateContext)
    visitor.clearContext.mockImplementation(clearContext)
    visitor.authenticate.mockImplementation(authenticate)
    visitor.unauthenticate.mockImplementation(unauthenticate)

    useContextMock.mockReturnValue({
      state: {
        config,
        sdkState: {
          isSdkReady: true
        }
      }
    })

    Flagship.close = jest.fn<()=>Promise<void>>()

    const { result } = renderHook(() => FsHooks.useFlagship())

    let fs = result.current

    const context = { key: 'context' }

    fs.updateContext(context)
    fs.clearContext()
    fs.sendHits({ type: HitType.PAGE, documentLocation: 'home' })
    fs.sendHits([{ type: HitType.PAGE, documentLocation: 'home' }])
    fs.authenticate('visitor_id')
    fs.unauthenticate()
    expect(config.logManager.error).toBeCalledTimes(6)

    useContextMock.mockReturnValue({
      state: {
        config,
        visitor,
        sdkState: {
          isSdkReady: true
        }
      }

    })

    const { result: result2 } = renderHook(() => FsHooks.useFlagship())

    fs = result2.current

    const flagKey = 'key'
    fs.getFlag(flagKey)

    expect(visitor.getFlag).toBeCalledTimes(1)
    expect(visitor.getFlag).toBeCalledWith(flagKey)

    fs.fetchFlags()
    expect(visitor.fetchFlags).toBeCalledTimes(1)

    fs.updateContext(context)
    fs.updateContext(context)

    expect(visitor.updateContext).toBeCalledTimes(2)
    expect(visitor.updateContext).toBeCalledWith(context)
    expect(visitor.fetchFlags).toBeCalledTimes(2)

    fs.clearContext()
    fs.clearContext()
    expect(visitor.clearContext).toBeCalledTimes(2)
    expect(visitor.fetchFlags).toBeCalledTimes(3)
    fs.setConsent(true)

    expect(visitor.setConsent).toBeCalledTimes(1)
    expect(visitor.setConsent).toBeCalledWith(true)

    const hit = { type: HitType.PAGE, documentLocation: 'home' }
    await fs.sendHits(hit)
    expect(visitor.sendHit).toBeCalledTimes(1)
    expect(visitor.sendHit).toBeCalledWith(hit)

    await fs.sendHits([hit])
    expect(visitor.sendHits).toBeCalledTimes(1)
    expect(visitor.sendHits).toBeCalledWith([hit])

    const visitorId = 'visitor_id'
    fs.authenticate(visitorId)
    fs.authenticate(visitorId)

    expect(visitor.authenticate).toBeCalledTimes(2)
    expect(visitor.authenticate).toBeCalledWith(visitorId)
    expect(visitor.fetchFlags).toBeCalledTimes(4)

    fs.unauthenticate()
    fs.unauthenticate()

    expect(visitor.unauthenticate).toBeCalledTimes(2)
    expect(visitor.fetchFlags).toBeCalledTimes(5)

    await fs.close()
    expect(Flagship.close).toBeCalledTimes(1)

    fs.getFlags()
    expect(visitor.getFlags).toBeCalledTimes(1)

    fs.collectEAIDataAsync()
    expect(visitor.collectEAIDataAsync).toBeCalledTimes(1)
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
        sdkState: {
          isSdkReady: false
        },
        flags: new Map([
          ['key', expected]
        ])
      }
    })

    const { result } = renderHook(() => FsHooks.useFlagship())

    const fs = result.current

    const flagKey = 'key'
    const flagDefaultValue = 'value'
    //
    const flag = fs.getFlag(flagKey)

    expect(flag).toBeDefined()
    expect(flag.getValue(flagDefaultValue)).toEqual(flagDefaultValue)

    fs.fetchFlags()
    expect(config.logManager.warning).toBeCalledTimes(1)

    fs.setConsent(true)
    expect(config.logManager.warning).toBeCalledTimes(2)

    const flags = fs.getFlags()
    expect(flags).toBeInstanceOf(FSFlagCollection)

    fs.collectEAIDataAsync()
  })
})
