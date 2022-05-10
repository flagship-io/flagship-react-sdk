import { expect, it, describe } from '@jest/globals'
import { Flag } from '../src/Flag'

describe('test Flag', () => {
  const defaultValue = 'value'
  const flag = new Flag(defaultValue)

  it('should ', () => {
    expect(flag.getValue()).toBe(defaultValue)
    expect(flag.exists()).toBe(false)
    expect(flag.userExposed()).resolves.toBeUndefined()
    expect(flag.metadata).toEqual({
      campaignId: '',
      campaignType: '',
      isReference: false,
      variationGroupId: '',
      variationId: '',
      slug:null
    })
  })
})
