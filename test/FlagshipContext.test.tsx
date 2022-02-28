import { jest, expect, it, describe } from '@jest/globals'
// eslint-disable-next-line no-use-before-define
import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { FlagshipProvider } from '../src/FlagshipContext'
import { SpyInstance, Mock } from 'jest-mock'
import { DecisionMode, Modification } from '@flagship.io/js-sdk'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let start:SpyInstance<any, unknown[]>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let newVisitor:SpyInstance<any, unknown[]>

const modifications = new Map<string, Modification>()

const synchronizeModifications = jest.fn()
const updateContext = jest.fn()
const unauthenticate = jest.fn()
const authenticate:Mock<void, [string]> = jest.fn()
const setConsent = jest.fn()
const clearContext = jest.fn()
const fetchFlags = jest.fn()

let onEventError = false

jest.mock('@flagship.io/js-sdk', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const flagship = jest.requireActual('@flagship.io/js-sdk') as any

  start = jest.spyOn(flagship.Flagship, 'start')
  newVisitor = jest.spyOn(flagship.Flagship, 'newVisitor')

  let fistStart = true
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  start.mockImplementation((apiKey, envId, { onBucketingUpdated, statusChangedCallback }:any) => {
    statusChangedCallback(1)
    statusChangedCallback(4)
    if (fistStart) {
      onBucketingUpdated(new Date())
      fistStart = false
    }
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let OnReadyCallback:(error?:any)=>void

  newVisitor.mockImplementation(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const EventOn:Mock<void, [string, (error?:any)=>void] > = jest.fn()

    EventOn.mockImplementation((e, callback) => {
      if (callback) {
        OnReadyCallback = callback
      }
    })

    synchronizeModifications.mockImplementation(() => {
      if (OnReadyCallback) {
        OnReadyCallback(onEventError ? new Error() : null)
      }
      return Promise.resolve()
    })

    fetchFlags.mockImplementation(() => {
      if (OnReadyCallback) {
        OnReadyCallback(onEventError ? new Error() : null)
      }
      return Promise.resolve()
    })

    const newVisitor = {
      anonymousId: '',
      synchronizeModifications,
      fetchFlags,
      on: EventOn,
      modifications,
      updateContext,
      unauthenticate,
      authenticate,
      setConsent,
      clearContext
    }

    authenticate.mockImplementation((visitorId) => {
      newVisitor.anonymousId = visitorId
    })
    unauthenticate.mockImplementation(() => {
      newVisitor.anonymousId = ''
    })

    newVisitor.fetchFlags()
    return newVisitor
  })

  return flagship
})

describe('Name of the group', () => {
  const visitorData = {
    id: 'visitor_id',
    context: {},
    isAuthenticated: false,
    hasConsented: true
  }
  const envId = 'EnvId'
  const apiKey = 'apiKey'
  const statusChangedCallback = jest.fn()
  const onInitStart = jest.fn()
  const onInitDone = jest.fn()
  const onUpdate = jest.fn()
  const onBucketingUpdated = jest.fn()

  it('should ', async () => {
    const props = {
      envId,
      apiKey,
      decisionMode: DecisionMode.DECISION_API,
      visitorData,
      statusChangedCallback,
      onInitStart,
      onInitDone,
      onUpdate,
      onBucketingUpdated,
      loadingComponent: <div></div>,
      synchronizeOnBucketingUpdated: true
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { rerender } = render(
            <FlagshipProvider {...props}>
               <div>children</div>
            </FlagshipProvider>)

    await waitFor(() => {
      expect(start).toBeCalledTimes(1)
      expect(start).toBeCalledWith(envId, apiKey, expect.objectContaining({ decisionMode: DecisionMode.DECISION_API, onBucketingUpdated: expect.anything() }))
      expect(newVisitor).toBeCalledTimes(1)

      expect(newVisitor).toBeCalledWith({
        visitorId: visitorData.id,
        context: visitorData.context,
        isAuthenticated: visitorData.isAuthenticated,
        hasConsented: visitorData.hasConsented
      })

      expect(fetchFlags).toBeCalledTimes(2)
      expect(onBucketingUpdated).toBeCalledTimes(1)
      expect(statusChangedCallback).toBeCalledTimes(2)
      expect(onInitStart).toBeCalledTimes(1)
      expect(onInitDone).toBeCalledTimes(1)
      expect(onUpdate).toBeCalledTimes(1)
    })

    // Authenticate visitor
    rerender(
      <FlagshipProvider {...props} visitorData={{ ...props.visitorData, isAuthenticated: true }}>
         <div>children</div>
      </FlagshipProvider>)

    await waitFor(() => {
      expect(start).toBeCalledTimes(1)
      expect(authenticate).toBeCalledTimes(1)
      expect(authenticate).toBeCalledWith(props.visitorData.id)
    })

    // Unauthenticate visitor
    rerender(
      <FlagshipProvider {...props} visitorData={{ ...props.visitorData, isAuthenticated: false }}>
         <div>children</div>
      </FlagshipProvider>)

    await waitFor(() => {
      expect(start).toBeCalledTimes(1)
      expect(authenticate).toBeCalledTimes(1)
      expect(unauthenticate).toBeCalledTimes(1)
    })

    // Update envId props
    rerender(
      <FlagshipProvider {...props} envId={'new_env_id'}>
         <div>children</div>
      </FlagshipProvider>)

    await waitFor(() => {
      expect(start).toBeCalledTimes(2)
      expect(start).toBeCalledWith('new_env_id', apiKey, expect.objectContaining({ decisionMode: DecisionMode.DECISION_API, onBucketingUpdated: expect.anything() }))
      expect(newVisitor).toBeCalledTimes(1)
      expect(fetchFlags).toBeCalledTimes(5)
      expect(authenticate).toBeCalledTimes(1)
      expect(unauthenticate).toBeCalledTimes(1)
    })

    onEventError = true

    rerender(
      <FlagshipProvider {...props} envId={'new_env'}>
         <div>children</div>
      </FlagshipProvider>)
  }
  )
})

describe('Name of the group', () => {
  const visitorData = {
    id: 'visitor_id',
    context: {},
    isAuthenticated: false,
    hasConsented: true
  }
  const envId = 'EnvId'
  const apiKey = 'apiKey'
  const statusChangedCallback = jest.fn()
  const onInitStart = jest.fn()
  const onInitDone = jest.fn()
  const onUpdate = jest.fn()
  const onBucketingUpdated = jest.fn()

  it('should ', async () => {
    const props = {
      envId,
      apiKey,
      decisionMode: DecisionMode.DECISION_API,
      visitorData: null,
      statusChangedCallback,
      onInitStart,
      onInitDone,
      onUpdate,
      onBucketingUpdated,
      loadingComponent: <div></div>,
      synchronizeOnBucketingUpdated: true
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { rerender } = render(
            <FlagshipProvider {...props}>
               <div>children</div>
            </FlagshipProvider>)

    await waitFor(() => {
      expect(start).toBeCalledTimes(1)
      expect(start).toBeCalledWith(envId, apiKey, expect.objectContaining({ decisionMode: DecisionMode.DECISION_API, onBucketingUpdated: expect.anything() }))
      expect(newVisitor).toBeCalledTimes(0)

      expect(fetchFlags).toBeCalledTimes(0)
      expect(onBucketingUpdated).toBeCalledTimes(0)
      expect(statusChangedCallback).toBeCalledTimes(2)
      expect(onInitStart).toBeCalledTimes(1)
      expect(onInitDone).toBeCalledTimes(1)
      expect(onUpdate).toBeCalledTimes(0)
    })

    rerender(
      <FlagshipProvider {...props} visitorData={visitorData}>
         <div>children</div>
      </FlagshipProvider>)

    await waitFor(() => {
      expect(start).toBeCalledTimes(1)
      expect(start).toBeCalledWith(envId, apiKey, expect.objectContaining({ decisionMode: DecisionMode.DECISION_API, onBucketingUpdated: expect.anything() }))
      expect(newVisitor).toBeCalledTimes(1)

      expect(newVisitor).toBeCalledWith({
        visitorId: visitorData.id,
        context: visitorData.context,
        isAuthenticated: visitorData.isAuthenticated,
        hasConsented: visitorData.hasConsented
      })

      expect(fetchFlags).toBeCalledTimes(1)
      expect(onBucketingUpdated).toBeCalledTimes(0)
      expect(statusChangedCallback).toBeCalledTimes(2)
      expect(onInitStart).toBeCalledTimes(1)
      expect(onInitDone).toBeCalledTimes(1)
      expect(onUpdate).toBeCalledTimes(0)
    })
  }
  )
})
