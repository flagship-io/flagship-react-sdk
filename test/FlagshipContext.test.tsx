import React from 'react'

import { jest, expect, it, describe } from '@jest/globals'
import { render, waitFor } from '@testing-library/react'
import { SpyInstance } from 'jest-mock'

import Flagship, { DecisionMode, FSSdkStatus, FlagDTO } from '@flagship.io/js-sdk'

import { useFlagship } from '../src/FlagshipHooks'
import { FlagshipProvider } from '../src/FlagshipProvider'

function sleep (ms: number): Promise<unknown> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockStart = Flagship.start as unknown as SpyInstance<typeof Flagship.start>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const newVisitor = Flagship.newVisitor as unknown as SpyInstance<typeof Flagship.newVisitor>
const flagsData = new Map<string, FlagDTO>()
const updateContext = jest.fn()
const unauthenticate = jest.fn()
const authenticate = jest.fn<(params: string)=>void>()
const setConsent = jest.fn()
const clearContext = jest.fn()
const fetchFlags = jest.fn()
const getFlagsDataArray = jest.fn()

let onEventError = false

jest.mock('@flagship.io/js-sdk', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const flagship = jest.requireActual('@flagship.io/js-sdk') as any

  const mockStart = jest.spyOn(flagship.Flagship, 'start')
  const newVisitor = jest.spyOn(flagship.Flagship, 'newVisitor')

  let fistStart = true
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mockStart.mockImplementation(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (_apiKey, _envId, { onBucketingUpdated, onSdkStatusChanged }: any) => {
      onSdkStatusChanged(FSSdkStatus.SDK_INITIALIZED)
      if (fistStart) {
        onBucketingUpdated(new Date())
        fistStart = false
      }
    }
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let OnReadyCallback: (error?: any) => void

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  newVisitor.mockImplementation(({ visitorId }:any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const EventOn = jest.fn<(e:string, callback:(error?: any) => void)=>void>()

    EventOn.mockImplementation((_e, callback) => {
      if (callback) {
        OnReadyCallback = callback
      }
    })

    fetchFlags.mockImplementation(async () => {
      await sleep(500)
      if (OnReadyCallback) {
        OnReadyCallback(onEventError ? new Error() : null)
      }
    })

    const newVisitor = {
      visitorId,
      anonymousId: '',
      fetchFlags,
      on: EventOn,
      getFlagsDataArray,
      flagsData,
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

describe('FlagshipProvide test', () => {
  const visitorData = {
    id: 'visitor_id',
    context: {},
    isAuthenticated: false,
    hasConsented: true
  }
  const envId = 'EnvId'
  const apiKey = 'apiKey'
  const onSdkStatusChanged = jest.fn()
  const onInitStart = jest.fn()
  const onInitDone = jest.fn()
  const onUpdate = jest.fn()
  const onBucketingUpdated = jest.fn()
  const props = {
    envId,
    apiKey,
    decisionMode: DecisionMode.DECISION_API,
    visitorData,
    onSdkStatusChanged,
    onInitStart,
    onInitDone,
    onUpdate,
    fetchNow: true,
    onBucketingUpdated,
    loadingComponent: <div></div>,
    fetchFlagsOnBucketingUpdated: true
  }

  it('should ', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { rerender } = render(
      <FlagshipProvider {...props}>
        <div>children</div>
      </FlagshipProvider>
    )

    await waitFor(() => {
      expect(mockStart).toBeCalledTimes(1)
      expect(mockStart).toBeCalledWith(
        envId,
        apiKey,
        expect.objectContaining({
          decisionMode: DecisionMode.DECISION_API,
          onBucketingUpdated: expect.anything()
        })
      )
      expect(newVisitor).toBeCalledTimes(1)

      expect(newVisitor).toBeCalledWith({
        visitorId: visitorData.id,
        context: visitorData.context,
        isAuthenticated: visitorData.isAuthenticated,
        hasConsented: visitorData.hasConsented
      })

      expect(fetchFlags).toBeCalledTimes(1)
      expect(onBucketingUpdated).toBeCalledTimes(1)
      expect(onSdkStatusChanged).toBeCalledTimes(1)
      expect(onUpdate).toBeCalledTimes(1)
    })

    // Authenticate visitor
    rerender(
      <FlagshipProvider
        {...props}
        visitorData={{ ...props.visitorData, isAuthenticated: true }}
      >
        <div>children</div>
      </FlagshipProvider>
    )

    await waitFor(() => {
      expect(mockStart).toBeCalledTimes(1)
      expect(authenticate).toBeCalledTimes(1)
      expect(fetchFlags).toBeCalledTimes(2)
      expect(onBucketingUpdated).toBeCalledTimes(1)
      expect(onSdkStatusChanged).toBeCalledTimes(1)
      // expect(onUpdate).toBeCalledTimes(2);
    })

    rerender(
      <FlagshipProvider
        {...props}
        visitorData={{ ...props.visitorData, id: 'visitor_2', isAuthenticated: true }}
      >
        <div>children</div>
      </FlagshipProvider>
    )

    await waitFor(() => {
      expect(mockStart).toBeCalledTimes(1)
      expect(authenticate).toBeCalledTimes(1)
      expect(fetchFlags).toBeCalledTimes(3)
      expect(onBucketingUpdated).toBeCalledTimes(1)
      expect(onSdkStatusChanged).toBeCalledTimes(1)
      expect(newVisitor).toBeCalledTimes(2)
    })

    // Unauthenticate visitor
    rerender(
      <FlagshipProvider
        {...props}
        visitorData={{ ...props.visitorData, isAuthenticated: false }}
      >
        <div>children</div>
      </FlagshipProvider>
    )

    await waitFor(() => {
      expect(mockStart).toBeCalledTimes(1)
      expect(unauthenticate).toBeCalledTimes(1)
      expect(newVisitor).toBeCalledTimes(2)
      expect(fetchFlags).toBeCalledTimes(4)
    })

    // Unauthenticate visitor
    rerender(
          <FlagshipProvider
            {...props}
            visitorData={{ ...props.visitorData, id: 'visitorId_4', isAuthenticated: false }}
          >
            <div>children</div>
          </FlagshipProvider>
    )

    await waitFor(() => {
      expect(mockStart).toBeCalledTimes(1)
      expect(unauthenticate).toBeCalledTimes(1)
      expect(newVisitor).toBeCalledTimes(3)
      expect(fetchFlags).toBeCalledTimes(5)
    })

    rerender(
      <FlagshipProvider
        {...props}
        visitorData={null}
      >
        <div>children</div>
      </FlagshipProvider>
    )

    await waitFor(() => {
      expect(mockStart).toBeCalledTimes(1)
      expect(unauthenticate).toBeCalledTimes(1)
      expect(newVisitor).toBeCalledTimes(3)
      expect(fetchFlags).toBeCalledTimes(5)
    })

    // Update envId props
    render(
      <FlagshipProvider {...props} envId={'new_env_id'}>
        <div>children</div>
      </FlagshipProvider>
    )

    await waitFor(() => {
      expect(mockStart).toBeCalledTimes(2)
      expect(mockStart).toBeCalledWith(
        'new_env_id',
        apiKey,
        expect.objectContaining({
          decisionMode: DecisionMode.DECISION_API,
          onBucketingUpdated: expect.anything()
        })
      )
      expect(newVisitor).toBeCalledTimes(4)
      expect(fetchFlags).toBeCalledTimes(6)
    })

    onEventError = true

    render(
      <FlagshipProvider {...props} envId={'new_env'}>
        <div>children</div>
      </FlagshipProvider>
    )
  })

  it('Test fetchNow false', async () => {
    // Update envId props
    render(
      <FlagshipProvider {...props} fetchNow={false} envId={'new_env_id'}>
        <div>children</div>
      </FlagshipProvider>
    )

    await waitFor(() => {
      expect(mockStart).toBeCalledTimes(1)
      expect(mockStart).toBeCalledWith(
        'new_env_id',
        apiKey,
        expect.objectContaining({
          decisionMode: DecisionMode.DECISION_API,
          onBucketingUpdated: expect.anything()
        })
      )
      expect(newVisitor).toBeCalledTimes(1)
    })
  })
})

describe('Test visitorData null', () => {
  const visitorData = {
    id: 'visitor_id',
    context: {},
    isAuthenticated: false,
    hasConsented: true
  }
  const envId = 'EnvId'
  const apiKey = 'apiKey'
  const onSdkStatusChanged = jest.fn()
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
      onSdkStatusChanged,
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
      </FlagshipProvider>
    )

    await waitFor(() => {
      expect(mockStart).toBeCalledTimes(1)
      expect(mockStart).toBeCalledWith(
        envId,
        apiKey,
        expect.objectContaining({
          decisionMode: DecisionMode.DECISION_API,
          onBucketingUpdated: expect.anything()
        })
      )
      expect(newVisitor).toBeCalledTimes(0)

      expect(fetchFlags).toBeCalledTimes(0)
      expect(onBucketingUpdated).toBeCalledTimes(0)
      expect(onSdkStatusChanged).toBeCalledTimes(1)
      expect(onUpdate).toBeCalledTimes(0)
    })

    rerender(
      <FlagshipProvider {...props} visitorData={visitorData}>
        <div>children</div>
      </FlagshipProvider>
    )

    await waitFor(() => {
      expect(mockStart).toBeCalledTimes(1)
      expect(mockStart).toBeCalledWith(
        envId,
        apiKey,
        expect.objectContaining({
          decisionMode: DecisionMode.DECISION_API,
          onBucketingUpdated: expect.anything()
        })
      )
      expect(newVisitor).toBeCalledTimes(1)

      expect(newVisitor).toBeCalledWith({
        visitorId: visitorData.id,
        context: visitorData.context,
        isAuthenticated: visitorData.isAuthenticated,
        hasConsented: visitorData.hasConsented
      })

      expect(fetchFlags).toBeCalledTimes(1)
      expect(onBucketingUpdated).toBeCalledTimes(0)
      expect(onSdkStatusChanged).toBeCalledTimes(1)
    })
  })
})

describe('Test initial data', () => {
  const visitorData = {
    id: 'visitor_id',
    context: {},
    isAuthenticated: false,
    hasConsented: true
  }
  const envId = 'EnvId'
  const apiKey = 'apiKey'

  const ChildComponent = () => {
    const fs = useFlagship()
    return <div>{fs.flagsData.map(item => (<div data-testid={item.key} key={item.key}>{item.value}</div>))}</div>
  }

  it('test initialFlagsData ', async () => {
    const props = {
      envId,
      apiKey,
      decisionMode: DecisionMode.DECISION_API,
      visitorData,
      initialFlagsData: [
        {
          key: 'key1',
          campaignId: 'campaignId1',
          campaignName: 'campaignName1',
          variationGroupId: 'variationGroupId2',
          variationGroupName: 'variationGroupName1',
          variationId: 'variationId3',
          variationName: 'variationName1',
          isReference: false,
          campaignType: 'ab',
          value: 'flagValue1'

        },
        {
          key: 'key2',
          campaignId: 'campaignId2',
          campaignName: 'campaignName2',
          variationGroupId: 'variationGroupId2',
          variationGroupName: 'variationGroupName',
          variationId: 'variationId3',
          variationName: 'variationName',
          isReference: false,
          campaignType: 'ab',
          value: 'flagValue2'

        }
      ]
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { getByTestId } = render(
      <FlagshipProvider {...props}>
        <ChildComponent/>
      </FlagshipProvider>
    )

    await waitFor(() => {
      expect(mockStart).toBeCalledTimes(1)
      expect(mockStart).toBeCalledWith(
        envId,
        apiKey,
        expect.objectContaining({
          decisionMode: DecisionMode.DECISION_API
        })
      )
      expect(newVisitor).toBeCalledTimes(1)
      expect(newVisitor).toBeCalledWith(expect.objectContaining({
        initialFlagsData: props.initialFlagsData
      }))

      expect(getByTestId('key1').textContent).toBe('flagValue1')
      expect(getByTestId('key2').textContent).toBe('flagValue2')
    })
  })

  it('test initialModifications ', async () => {
    const props = {
      envId,
      apiKey,
      decisionMode: DecisionMode.DECISION_API,
      visitorData,
      initialFlagsData: [
        {
          key: 'key1',
          campaignId: 'campaignId1',
          campaignName: 'campaignName1',
          variationGroupId: 'variationGroupId2',
          variationGroupName: 'variationGroupName2',
          variationId: 'variationId3',
          variationName: 'variationName1',
          isReference: false,
          campaignType: 'ab',
          value: 'flagValue1'

        },
        {
          key: 'key2',
          campaignId: 'campaignId2',
          campaignName: 'campaignName2',
          variationGroupId: 'variationGroupId2',
          variationGroupName: 'variationGroupName2',
          variationId: 'variationId3',
          variationName: 'variationName',
          isReference: false,
          campaignType: 'ab',
          value: 'flagValue2'

        }
      ]
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { getByTestId } = render(
      <FlagshipProvider {...props}>
        <ChildComponent/>
      </FlagshipProvider>
    )

    await waitFor(() => {
      expect(mockStart).toBeCalledTimes(1)
      expect(mockStart).toBeCalledWith(
        envId,
        apiKey,
        expect.objectContaining({
          decisionMode: DecisionMode.DECISION_API
        })
      )
      expect(newVisitor).toBeCalledTimes(1)
      expect(newVisitor).toBeCalledWith(expect.objectContaining({
        initialFlagsData: props.initialFlagsData
      }))
      expect(getByTestId('key1').textContent).toBe('flagValue1')
      expect(getByTestId('key2').textContent).toBe('flagValue2')
    })
  })

  it('test initialCampaigns ', async () => {
    const props = {
      envId,
      apiKey,
      decisionMode: DecisionMode.DECISION_API,
      visitorData,
      initialCampaigns: [
        {
          id: 'c1ndsu87m030114t8uu0',
          variationGroupId: 'c1ndta129mp0114nbtn0',
          variation: {
            id: 'c1ndta129mp0114nbtng',
            modifications: {
              type: 'FLAG',
              value: {
                background: 'rouge bordeau',
                btnColor: 'blue',
                keyBoolean: false,
                keyNumber: 558
              }
            },
            reference: false
          }
        }
      ]
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { getByTestId } = render(
      <FlagshipProvider {...props}>
        <ChildComponent/>
      </FlagshipProvider>
    )

    await waitFor(() => {
      expect(newVisitor).toBeCalledTimes(1)
      expect(newVisitor).toBeCalledWith(expect.objectContaining({
        initialCampaigns: props.initialCampaigns
      }))

      expect(getByTestId('btnColor').textContent).toBe('blue')
    })
  })

  it('test initialCampaigns ', async () => {
    const ChildComponent = () => {
      const fs = useFlagship()
      return <div>
        <div data-testid="status">{String(fs.sdkState.isSdkReady)}</div>
        <div data-testid="isLoading">{String(fs.sdkState.isLoading)}</div>
      </div>
    }

    mockStart.mockImplementationOnce(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (_apiKey, _envId, { onSdkStatusChanged }: any) => {
        onSdkStatusChanged(0)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return {} as any
      }
    )

    const props = {
      envId,
      apiKey,
      decisionMode: DecisionMode.DECISION_API,
      visitorData
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { getByTestId } = render(
      <FlagshipProvider {...props}>
        <ChildComponent/>
      </FlagshipProvider>
    )

    await waitFor(() => {
      expect(newVisitor).toBeCalledTimes(0)
      expect(getByTestId('status').textContent).toEqual('false')
      expect(getByTestId('isLoading').textContent).toEqual('false')
    })
  })
})
