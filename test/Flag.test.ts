import { FlagDTO, FlagMetadata } from '@flagship.io/js-sdk'
import { expect, it, describe } from '@jest/globals'
import { Flag } from '../src/Flag'

describe('test Flag', () => {
  const defaultValue = 'value'
  const key = 'key'
  const flag = new Flag(defaultValue, key, undefined)

  it('should ', () => {
    expect(flag.getValue()).toBe(defaultValue)
    expect(flag.exists()).toBe(false)
    expect(flag.userExposed()).resolves.toBeUndefined()
    expect(flag.metadata).toEqual(FlagMetadata.Empty())
  })

  it('should ', () => {
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
    const flag = new Flag(defaultValue, key, flagsData)
    expect(flag.getValue()).toBe(value)
    expect(flag.exists()).toBe(true)
    expect(flag.userExposed()).resolves.toBeUndefined()
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
  })

  it('should ', () => {
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
    const flag = new Flag(defaultValue, key, flagsData)
    expect(flag.getValue()).toBe(defaultValue)
    expect(flag.exists()).toBe(true)
    expect(flag.userExposed()).resolves.toBeUndefined()
    expect(flag.visitorExposed()).resolves.toBeUndefined()
    expect(flag.metadata).toEqual(FlagMetadata.Empty())
  })
})
