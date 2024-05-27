import { expect, it, describe } from '@jest/globals'

import { FSFlagStatus, FlagDTO, FSFlagMetadata } from '@flagship.io/js-sdk'

import { FSFlag } from '../src/FSFlag'
import { FsContextState } from '../src/type'

describe('Flag tests', () => {
  const defaultValue = 'value'
  const key = 'key'
  const flag = new FSFlag(key, {

  } as FsContextState)

  it('should have default value and empty metadata', () => {
    expect(flag.getValue(defaultValue)).toBe(defaultValue)
    expect(flag.exists()).toBe(false)
    expect(flag.visitorExposed()).resolves.toBeUndefined()
    expect(flag.metadata).toEqual(FSFlagMetadata.Empty())
    expect(flag.status).toEqual(FSFlagStatus.NOT_FOUND)
  })

  it('should have default value and empty metadata', () => {
    const flagsData = new Map<string, FlagDTO>()
    const flag = new FSFlag(key, {
      flags: flagsData
    } as FsContextState)
    expect(flag.getValue(defaultValue)).toBe(defaultValue)
    expect(flag.exists()).toBe(false)
    expect(flag.visitorExposed()).resolves.toBeUndefined()
    expect(flag.metadata).toEqual(FSFlagMetadata.Empty())
    expect(flag.status).toEqual(FSFlagStatus.NOT_FOUND)
  })

  it('should have overridden value and populated metadata', () => {
    const defaultValue = 'DefaultValue'
    const key = 'key'
    const value = 'value'
    const flagsData = new Map<string, FlagDTO>()
    flagsData.set(key, {
      key,
      campaignId: 'campaignId',
      campaignName: 'campaignName',
      campaignType: 'ab',
      variationGroupId: 'ab',
      variationGroupName: 'variationGroupName',
      variationId: 'varId',
      variationName: 'variationName',
      slug: 'slug',
      value
    })
    const flag = new FSFlag(key, {
      flags: flagsData
    } as FsContextState)
    expect(flag.getValue(defaultValue)).toBe(value)
    expect(flag.exists()).toBe(true)
    expect(flag.visitorExposed()).resolves.toBeUndefined()
    expect(flag.metadata).toEqual({
      campaignId: 'campaignId',
      campaignName: 'campaignName',
      campaignType: 'ab',
      isReference: false,
      variationGroupId: 'ab',
      variationGroupName: 'variationGroupName',
      variationId: 'varId',
      variationName: 'variationName',
      slug: 'slug'
    })
    expect(flag.status).toEqual(FSFlagStatus.FETCHED)
  })

  it('should have default value for non-string value', () => {
    const defaultValue = 'DefaultValue'
    const key = 'key'
    const value = 1
    const flagsData = new Map<string, FlagDTO>()
    flagsData.set(key, {
      key,
      campaignId: 'campaignId',
      campaignName: 'campaignName',
      campaignType: 'ab',
      variationGroupId: 'ab',
      variationGroupName: 'variationGroupName',
      variationId: 'varId',
      variationName: 'variationName',
      slug: 'slug',
      value
    })
    const flag = new FSFlag(key, {
      flags: flagsData
    } as FsContextState)
    expect(flag.getValue(defaultValue)).toBe(defaultValue)
    expect(flag.exists()).toBe(true)
    expect(flag.visitorExposed()).resolves.toBeUndefined()
  })

  it('should have default value when flag value is null', () => {
    const defaultValue = 'DefaultValue'
    const key = 'key'
    const value = null
    const flagsData = new Map<string, FlagDTO>()
    flagsData.set(key, {
      key,
      campaignId: 'campaignId',
      campaignName: 'campaignName',
      campaignType: 'ab',
      variationGroupId: 'ab',
      variationGroupName: 'variationGroupName',
      variationId: 'varId',
      variationName: 'variationName',
      slug: 'slug',
      value
    })
    const flag = new FSFlag(key, {
      flags: flagsData
    } as FsContextState)
    expect(flag.getValue(defaultValue)).toBe(defaultValue)
    expect(flag.exists()).toBe(true)
    expect(flag.visitorExposed()).resolves.toBeUndefined()
  })

  it('should have flag value when default value is null', () => {
    const defaultValue = null
    const key = 'key'
    const value = 'value1'
    const flagsData = new Map<string, FlagDTO>()
    flagsData.set(key, {
      key,
      campaignId: 'campaignId',
      campaignName: 'campaignName',
      campaignType: 'ab',
      variationGroupId: 'ab',
      variationGroupName: 'variationGroupName',
      variationId: 'varId',
      variationName: 'variationName',
      slug: 'slug',
      value
    })
    const flag = new FSFlag(key, {
      flags: flagsData
    } as FsContextState)
    expect(flag.getValue(defaultValue)).toBe(value)
    expect(flag.exists()).toBe(true)
    expect(flag.visitorExposed()).resolves.toBeUndefined()
  })
})
