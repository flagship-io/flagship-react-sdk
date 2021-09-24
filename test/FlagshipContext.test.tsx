import { jest, expect, it, describe, beforeEach, afterEach } from '@jest/globals'
// eslint-disable-next-line no-use-before-define
import React from 'react'
import ReactDOM from 'react-dom'
import { render, fireEvent, cleanup, waitFor } from '@testing-library/react'
import { FlagshipProvider } from '../src/FlagshipContext'
import { Mock, SpyInstance } from 'jest-mock'
import { DecisionMode } from '@flagship.io/js-sdk'

const sleep = (ms:number) :Promise<unknown> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}
let start:SpyInstance<any, unknown[]>
let newVisitor:SpyInstance<any, unknown[]>

jest.mock('@flagship.io/js-sdk', () => {
  const flagship = jest.requireActual('@flagship.io/js-sdk') as any

  start = jest.spyOn(flagship.Flagship, 'start')
  newVisitor = jest.spyOn(flagship.Flagship, 'newVisitor')
  const synchronizeModifications = jest.fn()
  let visitor:any
  newVisitor.mockImplementation(() => {
    visitor = Object.create(flagship.Visitor.prototype)

    const newVisitor = Object.assign(visitor, { setConsent: jest.fn(), synchronizeModifications: jest.fn() })
    newVisitor.synchronizeModifications()
    return newVisitor
  })
  synchronizeModifications.mockImplementation(() => {
    visitor.emit('ready')
    return Promise.resolve()
  })
  return flagship
})

describe('Name of the group', () => {
  const visitorData = {
    id: 'visitor_id',
    context: {},
    isAuthenticated: false
  }
  const envId = 'EnvId'
  const apiKey = 'apiKey'
  const statusChangedCallback = jest.fn()
  const onInitStart = jest.fn()
  const onInitDone = jest.fn()

  it('should ', async () => {
    const props = {
      envId,
      apiKey,
      decisionMode: DecisionMode.DECISION_API,
      visitorData,
      statusChangedCallback,
      onInitStart,
      onInitDone
    }
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
        isAuthenticated: visitorData.isAuthenticated
      })

      expect(statusChangedCallback).toBeCalledTimes(2)
      expect(onInitStart).toBeCalledTimes(1)
      expect(onInitDone).toBeCalledTimes(1)
    //   expect(axiosPost).toBeCalledTimes(1)
    })

    props.visitorData.context = { key: 'value' }
    rerender(
        <FlagshipProvider {...props}>
           <div>children</div>
        </FlagshipProvider>)
  }
  )
})
