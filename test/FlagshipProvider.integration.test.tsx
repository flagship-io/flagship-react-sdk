import React from 'react'
import { render, waitFor, act } from '@testing-library/react'
import { jest, expect, it, describe, beforeEach, afterEach } from '@jest/globals'
import Flagship, { DecisionMode, FSSdkStatus } from '@flagship.io/js-sdk'
import { FlagshipProvider } from '../src/FlagshipProvider'

describe('FlagshipProvider Integration Tests', () => {
  const envId = 'test-env-id'
  const apiKey = 'test-api-key'
  
  let mockStart: jest.MockedFunction<typeof Flagship.start>
  let mockNewVisitor: jest.MockedFunction<typeof Flagship.newVisitor>
  let mockGetStatus: jest.MockedFunction<typeof Flagship.getStatus>
  let mockGetConfig: jest.MockedFunction<typeof Flagship.getConfig>
  let mockClose: jest.MockedFunction<typeof Flagship.close>

  const createVisitorData = (overrides: Partial<{
    id: string
    context: Record<string, any>
    isAuthenticated: boolean
    hasConsented: boolean
  }> = {}) => ({
    id: 'visitor1',
    context: {},
    isAuthenticated: false,
    hasConsented: true,
    ...overrides
  })

  const createMockVisitor = (overrides: Record<string, any> = {}) => ({
    on: jest.fn(),
    fetchFlags: jest.fn(),
    updateContext: jest.fn(),
    setConsent: jest.fn(),
    authenticate: jest.fn(),
    unauthenticate: jest.fn(),
    cleanup: jest.fn(),
    ...overrides
  })

  beforeEach(() => {
    mockStart = jest.fn() as jest.MockedFunction<typeof Flagship.start>
    mockNewVisitor = jest.fn() as jest.MockedFunction<typeof Flagship.newVisitor>
    mockGetStatus = jest.fn() as jest.MockedFunction<typeof Flagship.getStatus>
    mockGetConfig = jest.fn() as jest.MockedFunction<typeof Flagship.getConfig>
    mockClose = jest.fn() as jest.MockedFunction<typeof Flagship.close>

    mockStart.mockImplementation(async (envId, apiKey, config) => {
      setTimeout(() => {
        if (config?.onSdkStatusChanged) {
          config.onSdkStatusChanged(FSSdkStatus.SDK_INITIALIZED)
        }
      }, 0)
      return {} as any
    })
    mockGetConfig.mockReturnValue({} as any)
    mockGetStatus.mockReturnValue(FSSdkStatus.SDK_INITIALIZED)
    mockClose.mockResolvedValue({} as any)
    
    Flagship.start = mockStart as any
    Flagship.newVisitor = mockNewVisitor as any
    Flagship.getStatus = mockGetStatus as any
    Flagship.getConfig = mockGetConfig as any
    Flagship.close = mockClose as any
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('SDK Initialization Edge Cases', () => {
    it('should handle SDK_NOT_INITIALIZED status', async () => {
      mockGetStatus.mockReturnValue(FSSdkStatus.SDK_NOT_INITIALIZED)

      const { getByText } = render(
        <FlagshipProvider
          envId={envId}
          apiKey={apiKey}
          visitorData={createVisitorData()}
        >
          <div>Test Component</div>
        </FlagshipProvider>
      )

      expect(getByText('Test Component')).toBeTruthy()
      expect(mockStart).toHaveBeenCalled()
      expect(mockNewVisitor).not.toHaveBeenCalled()
    })

    it('should handle SDK_PANIC status', async () => {
      mockGetStatus.mockReturnValue(FSSdkStatus.SDK_PANIC)
      mockNewVisitor.mockReturnValue(createMockVisitor() as any)

      render(
        <FlagshipProvider
          envId={envId}
          apiKey={apiKey}
          visitorData={createVisitorData()}
        >
          <div>Test Component</div>
        </FlagshipProvider>
      )

      await waitFor(() => {
        expect(mockNewVisitor).toHaveBeenCalled()
      })
    })

    it('should reinitialize SDK when envId changes', async () => {
      mockNewVisitor.mockReturnValue(createMockVisitor() as any)
      
      const { rerender } = render(
        <FlagshipProvider
          envId="env1"
          apiKey={apiKey}
          visitorData={createVisitorData()}
          fetchNow={false}
        >
          <div>Test</div>
        </FlagshipProvider>
      )

      await waitFor(() => {
        expect(mockStart).toHaveBeenCalledTimes(1)
        expect(mockNewVisitor).toHaveBeenCalledTimes(1)
      })

      rerender(
        <FlagshipProvider
          envId="env2"
          apiKey={apiKey}
          visitorData={createVisitorData()}
          fetchNow={false}
        >
          <div>Test</div>
        </FlagshipProvider>
      )

      await waitFor(() => {
        // SDK should reinitialize with new envId
        expect(mockStart).toHaveBeenCalledTimes(2)
      })
      
      // Verify envId changed
      const secondStartCall = mockStart.mock.calls[1]
      expect(secondStartCall[0]).toBe('env2')
    })

    it('should reinitialize SDK when apiKey changes', async () => {
      mockNewVisitor.mockReturnValue(createMockVisitor() as any)
      
      const { rerender } = render(
        <FlagshipProvider
          envId={envId}
          apiKey="key1"
          visitorData={createVisitorData()}
          fetchNow={false}
        >
          <div>Test</div>
        </FlagshipProvider>
      )

      await waitFor(() => {
        expect(mockStart).toHaveBeenCalledTimes(1)
        expect(mockNewVisitor).toHaveBeenCalledTimes(1)
      })

      rerender(
        <FlagshipProvider
          envId={envId}
          apiKey="key2"
          visitorData={createVisitorData()}
          fetchNow={false}
        >
          <div>Test</div>
        </FlagshipProvider>
      )

      await waitFor(() => {
        // SDK should reinitialize with new apiKey
        expect(mockStart).toHaveBeenCalledTimes(2)
      })
      
      // Verify apiKey changed
      const secondStartCall = mockStart.mock.calls[1]
      expect(secondStartCall[1]).toBe('key2')
    })

    it('should reinitialize SDK when decisionMode changes', async () => {
      mockNewVisitor.mockReturnValue(createMockVisitor() as any)
      
      const { rerender } = render(
        <FlagshipProvider
          envId={envId}
          apiKey={apiKey}
          decisionMode={DecisionMode.DECISION_API}
          visitorData={createVisitorData()}
          fetchNow={false}
        >
          <div>Test</div>
        </FlagshipProvider>
      )

      await waitFor(() => {
        expect(mockStart).toHaveBeenCalledTimes(1)
        expect(mockNewVisitor).toHaveBeenCalledTimes(1)
      })

      rerender(
        <FlagshipProvider
          envId={envId}
          apiKey={apiKey}
          decisionMode={DecisionMode.BUCKETING}
          visitorData={createVisitorData()}
          fetchNow={false}
        >
          <div>Test</div>
        </FlagshipProvider>
      )

      await waitFor(() => {
        // SDK should reinitialize with new decisionMode
        expect(mockStart).toHaveBeenCalledTimes(2)
      })
      
      // Verify decisionMode changed
      const secondStartCall = mockStart.mock.calls[1]
      expect(secondStartCall[2]?.decisionMode).toBe(DecisionMode.BUCKETING)
    })

    it('should NOT reinitialize SDK when other props change', async () => {
      const { rerender } = render(
        <FlagshipProvider
          envId={envId}
          apiKey={apiKey}
          hitDeduplicationTime={2}
          visitorData={createVisitorData()}
        >
          <div>Test</div>
        </FlagshipProvider>
      )

      expect(mockStart).toHaveBeenCalledTimes(1)

      rerender(
        <FlagshipProvider
          envId={envId}
          apiKey={apiKey}
          hitDeduplicationTime={5}
          visitorData={createVisitorData()}
        >
          <div>Test</div>
        </FlagshipProvider>
      )

      await waitFor(() => {
        // Should NOT reinitialize
        expect(mockClose).toHaveBeenCalledTimes(0)
        expect(mockStart).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('Visitor Creation Edge Cases', () => {
    it('should not create visitor when visitorData is null', () => {
      render(
        <FlagshipProvider
          envId={envId}
          apiKey={apiKey}
          visitorData={null}
        >
          <div>Test</div>
        </FlagshipProvider>
      )

      expect(mockNewVisitor).not.toHaveBeenCalled()
    })

    it('should not create visitor when visitorData is undefined', () => {
      render(
        <FlagshipProvider
          envId={envId}
          apiKey={apiKey}
          visitorData={null}
        >
          <div>Test</div>
        </FlagshipProvider>
      )

      expect(mockNewVisitor).not.toHaveBeenCalled()
    })

    it('should create visitor with minimal data', async () => {
      mockNewVisitor.mockReturnValue(createMockVisitor() as any)

      render(
        <FlagshipProvider
          envId={envId}
          apiKey={apiKey}
          visitorData={createVisitorData()}
        >
          <div>Test</div>
        </FlagshipProvider>
      )

      await waitFor(() => {
        expect(mockNewVisitor).toHaveBeenCalledWith(
          expect.objectContaining({
            visitorId: 'visitor1'
          })
        )
      })
    })

    it('should create visitor with all optional fields', async () => {
      const onFlagsStatusChanged = jest.fn()
      mockNewVisitor.mockReturnValue(createMockVisitor() as any)

      render(
        <FlagshipProvider
          envId={envId}
          apiKey={apiKey}
          visitorData={{
            id: 'visitor1',
            context: { age: 25 },
            isAuthenticated: true,
            hasConsented: false
          }}
          onFlagsStatusChanged={onFlagsStatusChanged}
          shouldSaveInstance={true}
        >
          <div>Test</div>
        </FlagshipProvider>
      )

      await waitFor(() => {
        expect(mockNewVisitor).toHaveBeenCalledWith(
          expect.objectContaining({
            visitorId: 'visitor1',
            context: { age: 25 },
            isAuthenticated: true,
            hasConsented: false,
            onFlagsStatusChanged: expect.any(Function),
            shouldSaveInstance: true
          })
        )
      })
    })

    it('should handle visitor ready event with error', async () => {
      const onFn = jest.fn((event: string, callback: (error: Error | null) => void) => {
        if (event === 'ready') {
          setTimeout(() => callback(new Error('Test error')), 0)
        }
      })
      const mockVisitor = createMockVisitor({ on: onFn })
      mockNewVisitor.mockReturnValue(mockVisitor as any)

      render(
        <FlagshipProvider
          envId={envId}
          apiKey={apiKey}
          visitorData={createVisitorData()}
          fetchNow={true}
        >
          <div>Test</div>
        </FlagshipProvider>
      )

      await waitFor(() => {
        expect(onFn).toHaveBeenCalledWith('ready', expect.any(Function))
      })

     
    })
  })

  describe('Loading Component', () => {
    it('should show loading component on first initialization when fetchNow is true', () => {
      const { getByTestId, queryByText } = render(
        <FlagshipProvider
          envId={envId}
          apiKey={apiKey}
          visitorData={createVisitorData()}
          fetchNow={true}
          loadingComponent={<div data-testid="loading">Loading...</div>}
        >
          <div>Test Component</div>
        </FlagshipProvider>
      )

      expect(getByTestId('loading')).toBeTruthy()
      expect(queryByText('Test Component')).toBeNull()
    })

    it('should not show loading component when fetchNow is false', () => {
      const { queryByTestId, getByText } = render(
        <FlagshipProvider
          envId={envId}
          apiKey={apiKey}
          visitorData={createVisitorData()}
          fetchNow={false}
          loadingComponent={<div data-testid="loading">Loading...</div>}
        >
          <div>Test Component</div>
        </FlagshipProvider>
      )

      expect(queryByTestId('loading')).toBeNull()
      expect(getByText('Test Component')).toBeTruthy()
    })

    it('should not show loading component on subsequent updates', async () => {
      const onFn = jest.fn((event: string, callback: (error: Error | null) => void) => {
        if (event === 'ready') {
          setTimeout(() => callback(null), 0)
        }
      })
      const mockVisitor = createMockVisitor({
        on: onFn,
        visitorId: 'visitor1',
        hasConsented: true
      })
      mockNewVisitor.mockReturnValue(mockVisitor as any)

      const { rerender, queryByTestId, getByText } = render(
        <FlagshipProvider
          envId={envId}
          apiKey={apiKey}
          visitorData={createVisitorData()}
          fetchNow={true}
          loadingComponent={<div data-testid="loading">Loading...</div>}
        >
          <div>Test Component</div>
        </FlagshipProvider>
      )

      await waitFor(() => {
        expect(getByText('Test Component')).toBeTruthy()
      })

      rerender(
        <FlagshipProvider
          envId={envId}
          apiKey={apiKey}
          visitorData={createVisitorData({ context: { updated: true } })}
          fetchNow={true}
          loadingComponent={<div data-testid="loading">Loading...</div>}
        >
          <div>Test Component</div>
        </FlagshipProvider>
      )

      expect(queryByTestId('loading')).toBeNull()
      expect(getByText('Test Component')).toBeTruthy()
    })
  })

  describe('Callback Edge Cases', () => {
    it('should call onSdkStatusChanged with correct status', async () => {
      const onSdkStatusChanged = jest.fn()
      
      render(
        <FlagshipProvider
          envId={envId}
          apiKey={apiKey}
          visitorData={createVisitorData()}
          onSdkStatusChanged={onSdkStatusChanged}
        >
          <div>Test</div>
        </FlagshipProvider>
      )

      await waitFor(() => {
        expect(onSdkStatusChanged).toHaveBeenCalledWith(FSSdkStatus.SDK_INITIALIZED)
      })
    })

    it('should call onBucketingUpdated when bucketing updates', async () => {
      const onBucketingUpdated = jest.fn()
      let bucketingCallback: any

      mockStart.mockImplementation((envId: string, apiKey: string, config: any) => {
        bucketingCallback = config.onBucketingUpdated
        return Promise.resolve({} as any)
      })

      render(
        <FlagshipProvider
          envId={envId}
          apiKey={apiKey}
          visitorData={createVisitorData()}
          onBucketingUpdated={onBucketingUpdated}
        >
          <div>Test</div>
        </FlagshipProvider>
      )

      await waitFor(() => {
        expect(mockStart).toHaveBeenCalled()
      })

      const testDate = new Date()
      act(() => {
        bucketingCallback(testDate)
      })

      expect(onBucketingUpdated).toHaveBeenCalledWith(testDate)
    })

    it('should call onFlagsStatusChanged when flags status changes', async () => {
      const onFlagsStatusChanged = jest.fn()
      mockNewVisitor.mockReturnValue(createMockVisitor() as any)

      render(
        <FlagshipProvider
          envId={envId}
          apiKey={apiKey}
          visitorData={createVisitorData()}
          onFlagsStatusChanged={onFlagsStatusChanged}
        >
          <div>Test</div>
        </FlagshipProvider>
      )

      await waitFor(() => {
        expect(mockNewVisitor).toHaveBeenCalledWith(
          expect.objectContaining({
            onFlagsStatusChanged: expect.any(Function)
          })
        )
      })

      const flagsStatusCallback = (mockNewVisitor.mock.calls[0][0] as any).onFlagsStatusChanged
      act(() => {
        flagsStatusCallback({ status: 'FETCHED', reason: 'Success' })
      })

      expect(onFlagsStatusChanged).toHaveBeenCalledWith({ status: 'FETCHED', reason: 'Success' })
    })
  })

  describe('Memory Leak Prevention', () => {
    it('should cleanup visitor on unmount', async () => {
      const cleanupFn = jest.fn()
      const mockVisitor = createMockVisitor({ cleanup: cleanupFn })
      mockNewVisitor.mockReturnValue(mockVisitor as any)

      const { unmount } = render(
        <FlagshipProvider
          envId={envId}
          apiKey={apiKey}
          visitorData={createVisitorData()}
          fetchNow={false}
        >
          <div>Test</div>
        </FlagshipProvider>
      )

      await waitFor(() => {
        expect(mockNewVisitor).toHaveBeenCalled()
      })

      unmount()

      expect(cleanupFn).toHaveBeenCalled()
      expect(mockClose).toHaveBeenCalled()
    })

    it('should cleanup old visitor when recreating', async () => {
      const cleanup1 = jest.fn()
      const cleanup2 = jest.fn()
      const mockVisitor1 = createMockVisitor({ cleanup: cleanup1, visitorId: 'visitor1' })
      const mockVisitor2 = createMockVisitor({ cleanup: cleanup2, visitorId: 'visitor2' })
      mockNewVisitor.mockReturnValueOnce(mockVisitor1 as any).mockReturnValueOnce(mockVisitor2 as any)

      const { rerender } = render(
        <FlagshipProvider
          envId={envId}
          apiKey={apiKey}
          visitorData={createVisitorData()}
          fetchNow={false}
        >
          <div>Test</div>
        </FlagshipProvider>
      )

      await waitFor(() => {
        expect(mockNewVisitor).toHaveBeenCalledTimes(1)
      })

      rerender(
        <FlagshipProvider
          envId={envId}
          apiKey={apiKey}
          visitorData={createVisitorData({ id: 'visitor2' })}
          fetchNow={false}
        >
          <div>Test</div>
        </FlagshipProvider>
      )

      await waitFor(() => {
        expect(cleanup1).toHaveBeenCalled()
        expect(mockNewVisitor).toHaveBeenCalledTimes(2)
      })
    })
  })

  describe('Context Deep Equality', () => {
    it('should not recreate visitor when context reference changes but content is same', async () => {
      const mockVisitor = createMockVisitor({ visitorId: 'visitor1' })
      mockNewVisitor.mockReturnValue(mockVisitor as any)

      const { rerender } = render(
        <FlagshipProvider
          envId={envId}
          apiKey={apiKey}
          visitorData={createVisitorData({ context: { age: 25 } })}
          fetchNow={false}
        >
          <div>Test</div>
        </FlagshipProvider>
      )

      await waitFor(() => {
        expect(mockNewVisitor).toHaveBeenCalledTimes(1)
      })

      // Same content, different reference
      rerender(
        <FlagshipProvider
          envId={envId}
          apiKey={apiKey}
          visitorData={createVisitorData({ context: { age: 25 } })}
          fetchNow={false}
        >
          <div>Test</div>
        </FlagshipProvider>
      )

      await waitFor(() => {
        // Should NOT create new visitor
        expect(mockNewVisitor).toHaveBeenCalledTimes(1)
      })
    })

    it('should update visitor when context content actually changes', async () => {
      const updateContextFn = jest.fn()
      const fetchFlagsFn = jest.fn()
      const mockVisitor = createMockVisitor({
        updateContext: updateContextFn,
        fetchFlags: fetchFlagsFn,
        visitorId: 'visitor1',
        hasConsented: true
      })
      mockNewVisitor.mockReturnValue(mockVisitor as any)

      const { rerender } = render(
        <FlagshipProvider
          envId={envId}
          apiKey={apiKey}
          visitorData={createVisitorData({ context: { age: 25 } })}
          fetchNow={false}
        >
          <div>Test</div>
        </FlagshipProvider>
      )

      await waitFor(() => {
        expect(mockNewVisitor).toHaveBeenCalledTimes(1)
      })

      rerender(
        <FlagshipProvider
          envId={envId}
          apiKey={apiKey}
          visitorData={createVisitorData({ context: { age: 30 } })}
          fetchNow={false}
        >
          <div>Test</div>
        </FlagshipProvider>
      )

      await waitFor(() => {
        expect(updateContextFn).toHaveBeenCalledWith({ age: 30 })
        expect(fetchFlagsFn).toHaveBeenCalled()
      })
    })
  })
})
