import React from 'react'
import { jest, expect, it, describe, beforeEach, afterEach } from '@jest/globals'
import { renderHook } from '@testing-library/react-hooks'
import * as FsHooks from '../src/FlagshipHooks'
import { useFsModificationInfo, useFsModifications, useFsSynchronizeModifications } from '../src/FlagshipHooks'
import { Mock } from 'jest-mock'
import { HitType, LogLevel, Modification } from '@flagship.io/js-sdk'

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

  it('useFsModifications return default ', async () => {
    useContextMock.mockReturnValue({ state: {} })
    const result = await useFsModifications({ key: 'key', defaultValue: 'default' })
    expect(result).toBe('default')
  })

  it('useFsModifications return array of default ', async () => {
    useContextMock.mockReturnValue({ state: {} })
    const keys = [{ key: 'key', defaultValue: 'default' }, { key: 'key1', defaultValue: 'default1' }]
    const result = await useFsModifications(keys)
    expect(result).toEqual(keys.map(item => item.defaultValue))
  })

  it('useFsModifications modifications ', async () => {
    const visitor = {
      getModificationSync: jest.fn()
    }
    const expected = ['key1', 'key2']

    visitor.getModificationSync.mockReturnValue(expected)
    useContextMock.mockReturnValue({ state: { visitor } })
    const keys = [{ key: 'key', defaultValue: 'default' }, { key: 'key1', defaultValue: 'default1' }]
    const result = await useFsModifications(keys)
    expect(result).toEqual(expected)
    expect(visitor.getModificationSync).toBeCalledTimes(1)
    expect(visitor.getModificationSync).toBeCalledWith(keys, undefined)
  })

  it('useFsModificationInfo return null ', async () => {
    useContextMock.mockReturnValue({ state: {} })

    const key = 'key'
    const result = await useFsModificationInfo(key)
    expect(result).toBeNull()
  })

  it('useFsModificationInfo return modification ', async () => {
    const visitor = {
      getModificationInfoSync: jest.fn()
    }

    useContextMock.mockReturnValue({ state: { visitor } })

    const expected = new Modification('key', 'campaignId', 'variationGroupId', 'variation', true, 'value')

    visitor.getModificationInfoSync.mockReturnValue(expected)

    const key = 'key'
    const result = await useFsModificationInfo(key)
    expect(result).toEqual(expected)
    expect(visitor.getModificationInfoSync).toBeCalledTimes(1)
    expect(visitor.getModificationInfoSync).toBeCalledWith(key)
  })

  it('useFsSynchronizeModifications  ', async () => {
    const visitor = {
      synchronizeModifications: jest.fn<Promise<void>, void[]>()
    }
    visitor.synchronizeModifications.mockResolvedValue()
    useContextMock.mockReturnValue({ state: { visitor } })
    useFsSynchronizeModifications().then(() => {
      expect(visitor.synchronizeModifications).toBeCalledTimes(1)
    })
  })

  it('useFsSynchronizeModifications ', async () => {
    const config = {
      logManager: {
        error: jest.fn()
      },
      logLevel: LogLevel.ERROR
    }
    const visitor = {
      synchronizeModifications: jest.fn<Promise<void>, void[]>()
    }
    visitor.synchronizeModifications.mockRejectedValue('error')

    useContextMock.mockReturnValue({ state: { visitor, config } })
    await useFsSynchronizeModifications()

    expect(visitor.synchronizeModifications).toBeCalledTimes(1)
    expect(config.logManager.error).toBeCalledTimes(1)

    useContextMock.mockReturnValue({ state: { config } })
    useFsSynchronizeModifications()
      .then(() => {
        expect(config.logManager.error).toBeCalledTimes(2)
      })
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

    await FsHooks.useFsActivate(key)

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
      activateModificationSync: jest.fn<Promise<void>, void[]>()
    }
    visitor.activateModificationSync.mockResolvedValue()
    useContextMock.mockReturnValue({ state: { config, visitor } })
    const key = 'Key'

    await FsHooks.useFsActivate(key)
    expect(visitor.activateModificationSync).toBeCalledTimes(1)
    expect(visitor.activateModificationSync).toBeCalledWith(key)
    expect(config.logManager.warning).toBeCalledTimes(0)
  })

  it('should ', async () => {
    const config = {
      logManager: {
        error: jest.fn()
      },
      logLevel: LogLevel.ALL
    }
    const visitor = {
      updateContext: jest.fn(),
      clearContext: jest.fn(),
      authenticate: jest.fn(),
      unauthenticate: jest.fn(),
      synchronizeModifications: jest.fn(),
      modificationsAsync: jest.fn(),
      modifications: jest.fn(),
      getModificationInfo: jest.fn(),
      getModificationInfoSync: jest.fn(),
      getModificationSync: jest.fn(),
      sendHit: jest.fn()

    }
    useContextMock.mockReturnValue({ state: { config } })

    let fs = FsHooks.useFlagship()

    const context = { key: 'context' }

    fs.updateContext(context)
    fs.cleanContext()
    fs.hit.send({ type: HitType.PAGE, documentLocation: 'home' })
    fs.hit.sendMultiple([{ type: HitType.PAGE, documentLocation: 'home' }])
    fs.authenticate('visitor_id')
    fs.unauthenticate()
    expect(config.logManager.error).toBeCalledTimes(6)

    useContextMock.mockReturnValue({ state: { config, visitor } })

    fs = FsHooks.useFlagship()

    fs.updateContext(context)

    expect(visitor.updateContext).toBeCalledTimes(1)
    expect(visitor.updateContext).toBeCalledWith(context)

    fs.cleanContext()
    expect(visitor.clearContext).toBeCalledTimes(1)

    const hit = { type: HitType.PAGE, documentLocation: 'home' }
    await fs.hit.send(hit)
    expect(visitor.sendHit).toBeCalledTimes(1)
    expect(visitor.sendHit).toBeCalledWith(hit)

    await fs.hit.sendMultiple([hit])
    expect(visitor.sendHit).toBeCalledTimes(2)
    expect(visitor.sendHit).toBeCalledWith([hit])

    const visitorId = 'visitor_id'
    fs.authenticate(visitorId)

    expect(visitor.authenticate).toBeCalledTimes(1)
    expect(visitor.authenticate).toBeCalledWith(visitorId)

    fs.unauthenticate()

    expect(visitor.unauthenticate).toBeCalledTimes(1)
  })
})
