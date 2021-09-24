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

jest.mock('@flagship.io/js-sdk', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const flagship = jest.requireActual('@flagship.io/js-sdk') as any

  start = jest.spyOn(flagship.Flagship, 'start')
  newVisitor = jest.spyOn(flagship.Flagship, 'newVisitor')
  const synchronizeModifications = jest.fn()

  newVisitor.mockImplementation(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const EventOn:Mock<void, [string, (error?:any)=>void] > = jest.fn()

    EventOn.mockImplementation((e, callback) => {
      if (callback) {
        callback()
      }
    })

    synchronizeModifications.mockImplementation(() => {
      return Promise.resolve()
    })

    const newVisitor = { synchronizeModifications, on: EventOn, modifications }
    newVisitor.synchronizeModifications()
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

  it('should ', async () => {
    const props = {
      envId,
      apiKey,
      decisionMode: DecisionMode.DECISION_API,
      visitorData,
      statusChangedCallback,
      onInitStart,
      onInitDone,
      onUpdate
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

      expect(statusChangedCallback).toBeCalledTimes(2)
      expect(onInitStart).toBeCalledTimes(1)
      expect(onInitDone).toBeCalledTimes(1)
      expect(onUpdate).toBeCalledTimes(1)
    })
  }
  )
})
