import { FlagDTO, FlagMetadata } from '@flagship.io/js-sdk'
import { expect, it, describe } from '@jest/globals'
import { Flag } from '../src/Flag'

describe('test Flag', () => {
  const defaultValue = 'value'
  const key = "key"
  const flag = new Flag(defaultValue, key, undefined)

  it('should ', () => {
    expect(flag.getValue()).toBe(defaultValue)
    expect(flag.exists()).toBe(false)
    expect(flag.userExposed()).resolves.toBeUndefined()
    expect(flag.metadata).toEqual(FlagMetadata.Empty())
  })

  it('should ', () => {
    const defaultValue = 'DefaultValue'
    const key = "key"
    const value = "value"
    const flagsData = new Map<string, FlagDTO>()
    flagsData.set(key, {
      key,
      campaignId:"campaignId",
      campaignType:"ab",
      variationGroupId:"ab",
      variationId:"varId",
      slug:"slug",
      value
    })
    const flag = new Flag(defaultValue, key, flagsData)
    expect(flag.getValue()).toBe(value)
    expect(flag.exists()).toBe(true)
    expect(flag.userExposed()).resolves.toBeUndefined()
    expect(flag.metadata).toEqual({
      campaignId: 'campaignId',
      campaignType: 'ab',
      isReference: false,
      variationGroupId: 'ab',
      variationId: 'varId',
      slug:"slug"
    })
  })

  it('should ', () => {
    const defaultValue = 'DefaultValue'
    const key = "key"
    const value = 1
    const flagsData = new Map<string, FlagDTO>()
    flagsData.set(key, {
      key,
      campaignId:"campaignId",
      campaignType:"ab",
      variationGroupId:"ab",
      variationId:"varId",
      slug:"slug",
      value
    })
    const flag = new Flag(defaultValue, key, flagsData)
    expect(flag.getValue()).toBe(defaultValue)
    expect(flag.exists()).toBe(true)
    expect(flag.userExposed()).resolves.toBeUndefined()
    expect(flag.metadata).toEqual(FlagMetadata.Empty())
  })
})
