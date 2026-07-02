import React from 'react'

import { jest, expect, it, describe, beforeEach, afterEach } from '@jest/globals'
import { renderHook } from '@testing-library/react-hooks'
import { Mock } from 'jest-mock'

import { FSFlagCollection } from '@flagship.io/js-sdk'

import * as FsHooks from '../src/FlagshipHooks'

describe('repro: stale ref when reading getFlags() synchronously during render', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let realUseContext: <T>(context: React.Context<T>) => any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let useContextMock: Mock<(context: React.Context<any>) => any>

  beforeEach(() => {
    realUseContext = React.useContext
    useContextMock = jest.fn()
    React.useContext = useContextMock
  })

  afterEach(() => {
    React.useContext = realUseContext
  })

  it('getFlags() called inline in render should reflect the visitor from the SAME render, not a previous one', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const readSnapshots: any[] = []

    // Render 1: no visitor yet, still fetching
    useContextMock.mockReturnValue({
      state: { flagsStatus: { status: 'FETCHING', reason: 'NONE' }, flags: new Map() }
    })

    const { rerender } = renderHook(() => {
      const hook = FsHooks.useFlagship()
      // Mimic a consumer component that reads flags directly in its render body,
      // e.g.: const { getFlags, flagsStatus } = useFlagship(); const flags = getFlags()
      readSnapshots.push({ status: hook.flagsStatus, flags: hook.getFlags() })
      return hook
    })

    // Render 2: visitor becomes ready AND flagsStatus flips to FETCHED in the SAME state update
    const visitor = {
      getFlags: jest.fn(() => new FSFlagCollection({ flags: new Map([['my-flag', { key: 'my-flag' }]]) as any }))
    }
    useContextMock.mockReturnValue({
      state: { visitor, flagsStatus: { status: 'FETCHED', reason: 'NONE' } }
    })

    rerender()

    const lastSnapshot = readSnapshots[readSnapshots.length - 1]

    expect(lastSnapshot.status).toEqual({ status: 'FETCHED', reason: 'NONE' })
    // This is the actual bug: with the old useEffect-based useLatestRef, the ref
    // is still pointing at the *previous* (visitor-less) render when getFlags()
    // is read synchronously during render, so this comes back empty even though
    // flagsStatus already says FETCHED.
    expect(lastSnapshot.flags.size).toBe(1)
  })
})
