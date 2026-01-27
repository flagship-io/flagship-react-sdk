import { renderHook } from '@testing-library/react-hooks'
import { describe, it, expect } from '@jest/globals'
import {
  useLatestRef,
  shouldRecreateVisitor,
  updateVisitorData,
  shouldUpdateConsent,
  getAuthenticationAction
} from '../src/hooks'

describe('hooks utilities', () => {
  describe('useLatestRef', () => {
    it('should return ref with initial value', () => {
      const { result } = renderHook(() => useLatestRef('initial'))
      expect(result.current.current).toBe('initial')
    })

    it('should update ref when value changes', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useLatestRef(value),
        { initialProps: { value: 'first' } }
      )
      
      expect(result.current.current).toBe('first')
      
      rerender({ value: 'second' })
      expect(result.current.current).toBe('second')
    })

    it('should maintain same ref object across renders', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useLatestRef(value),
        { initialProps: { value: 'test' } }
      )
      
      const firstRef = result.current
      rerender({ value: 'test2' })
      const secondRef = result.current
      
      expect(firstRef).toBe(secondRef) 
      expect(firstRef.current).toBe('test2') 
    })

    it('should work with complex objects', () => {
      const obj = { name: 'test', age: 25 }
      const { result, rerender } = renderHook(
        ({ value }) => useLatestRef(value),
        { initialProps: { value: obj } }
      )
      
      expect(result.current.current).toEqual(obj)
      
      const newObj = { name: 'updated', age: 30 }
      rerender({ value: newObj })
      expect(result.current.current).toEqual(newObj)
    })
  })

  describe('shouldRecreateVisitor', () => {
    it('should return true when visitor is undefined', () => {
      expect(shouldRecreateVisitor(undefined, 'visitor123', false)).toBe(true)
    })

    it('should return false when visitor ID has not changed', () => {
      const visitor = {
        visitorId: 'visitor123',
        anonymousId: null
      } as any
      
      expect(shouldRecreateVisitor(visitor, 'visitor123', false)).toBe(false)
    })

    it('should return true when ID changed and not authenticated', () => {
      const visitor = {
        visitorId: 'visitor123',
        anonymousId: null
      } as any
      
      expect(shouldRecreateVisitor(visitor, 'visitor456', false)).toBe(true)
    })

    it('should return true when ID changed, authenticated, and has anonymousId', () => {
      const visitor = {
        visitorId: 'visitor123',
        anonymousId: 'anon123'
      } as any
      
      expect(shouldRecreateVisitor(visitor, 'visitor456', true)).toBe(true)
    })

    it('should return false when ID changed, authenticated, but no anonymousId', () => {
      const visitor = {
        visitorId: 'visitor123',
        anonymousId: null
      } as any
      
      expect(shouldRecreateVisitor(visitor, 'visitor456', true)).toBe(false)
    })

    it('should handle empty string anonymousId as falsy', () => {
      const visitor = {
        visitorId: 'visitor123',
        anonymousId: ''
      } as any
      
      expect(shouldRecreateVisitor(visitor, 'visitor456', true)).toBe(false)
    })
  })

  describe('shouldUpdateConsent', () => {
    it('should return true when consent changed from true to false', () => {
      const visitor = { hasConsented: true } as any
      expect(shouldUpdateConsent(visitor, false)).toBe(true)
    })

    it('should return true when consent changed from false to true', () => {
      const visitor = { hasConsented: false } as any
      expect(shouldUpdateConsent(visitor, true)).toBe(true)
    })

    it('should return false when consent unchanged', () => {
      const visitor = { hasConsented: true } as any
      expect(shouldUpdateConsent(visitor, true)).toBe(false)
    })

    it('should handle undefined consent', () => {
      const visitor = { hasConsented: true } as any
      expect(shouldUpdateConsent(visitor, undefined)).toBe(true)
    })

    it('should handle visitor with undefined consent', () => {
      const visitor = { hasConsented: undefined } as any
      expect(shouldUpdateConsent(visitor, true)).toBe(true)
    })
  })

  describe('getAuthenticationAction', () => {
    it('should return "authenticate" when visitor not anonymous and isAuthenticated true', () => {
      const visitor = {
        anonymousId: null,
        visitorId: 'visitor123'
      } as any
      
      expect(getAuthenticationAction(visitor, true)).toBe('authenticate')
    })

    it('should return "unauthenticate" when visitor has anonymousId and isAuthenticated false', () => {
      const visitor = {
        anonymousId: 'anon123',
        visitorId: 'visitor123'
      } as any
      
      expect(getAuthenticationAction(visitor, false)).toBe('unauthenticate')
    })

    it('should return null when visitor has anonymousId and isAuthenticated true', () => {
      const visitor = {
        anonymousId: 'anon123',
        visitorId: 'visitor123'
      } as any
      
      expect(getAuthenticationAction(visitor, true)).toBe(null)
    })

    it('should return null when visitor not anonymous and isAuthenticated false', () => {
      const visitor = {
        anonymousId: null,
        visitorId: 'visitor123'
      } as any
      
      expect(getAuthenticationAction(visitor, false)).toBe(null)
    })

    it('should return null when isAuthenticated is undefined', () => {
      const visitor = {
        anonymousId: null,
        visitorId: 'visitor123'
      } as any
      
      expect(getAuthenticationAction(visitor, undefined)).toBe(null)
    })

    it('should handle empty string anonymousId as falsy', () => {
      const visitor = {
        anonymousId: '',
        visitorId: 'visitor123'
      } as any
      
      expect(getAuthenticationAction(visitor, true)).toBe('authenticate')
    })
  })

  describe('updateVisitorData', () => {
    it('should update consent when changed', () => {
      const visitor = {
        hasConsented: false,
        setConsent: jest.fn(),
        updateContext: jest.fn(),
        authenticate: jest.fn(),
        unauthenticate: jest.fn(),
        fetchFlags: jest.fn(),
        anonymousId: null
      } as any

      updateVisitorData(visitor, 'visitor123', { key: 'value' }, true, false)

      expect(visitor.setConsent).toHaveBeenCalledWith(true)
      expect(visitor.updateContext).toHaveBeenCalledWith({ key: 'value' })
      expect(visitor.fetchFlags).toHaveBeenCalled()
    })

    it('should not update consent when unchanged', () => {
      const visitor = {
        hasConsented: true,
        setConsent: jest.fn(),
        updateContext: jest.fn(),
        authenticate: jest.fn(),
        unauthenticate: jest.fn(),
        fetchFlags: jest.fn(),
        anonymousId: null
      } as any

      updateVisitorData(visitor, 'visitor123', { key: 'value' }, true, false)

      expect(visitor.setConsent).not.toHaveBeenCalled()
      expect(visitor.updateContext).toHaveBeenCalledWith({ key: 'value' })
      expect(visitor.fetchFlags).toHaveBeenCalled()
    })

    it('should authenticate visitor when not anonymous and isAuthenticated true', () => {
      const visitor = {
        hasConsented: true,
        setConsent: jest.fn(),
        updateContext: jest.fn(),
        authenticate: jest.fn(),
        unauthenticate: jest.fn(),
        fetchFlags: jest.fn(),
        anonymousId: null
      } as any

      updateVisitorData(visitor, 'visitor123', { key: 'value' }, true, true)

      expect(visitor.authenticate).toHaveBeenCalledWith('visitor123')
      expect(visitor.fetchFlags).toHaveBeenCalled()
    })

    it('should unauthenticate visitor when has anonymousId and isAuthenticated false', () => {
      const visitor = {
        hasConsented: true,
        setConsent: jest.fn(),
        updateContext: jest.fn(),
        authenticate: jest.fn(),
        unauthenticate: jest.fn(),
        fetchFlags: jest.fn(),
        anonymousId: 'anon123'
      } as any

      updateVisitorData(visitor, 'visitor123', { key: 'value' }, true, false)

      expect(visitor.unauthenticate).toHaveBeenCalled()
      expect(visitor.fetchFlags).toHaveBeenCalled()
    })

    it('should update context with empty object', () => {
      const visitor = {
        hasConsented: true,
        setConsent: jest.fn(),
        updateContext: jest.fn(),
        authenticate: jest.fn(),
        unauthenticate: jest.fn(),
        fetchFlags: jest.fn(),
        anonymousId: null
      } as any

      updateVisitorData(visitor, 'visitor123', {}, true, false)

      expect(visitor.updateContext).toHaveBeenCalledWith({})
      expect(visitor.fetchFlags).toHaveBeenCalled()
    })

    it('should handle consent undefined by defaulting to true', () => {
      const visitor = {
        hasConsented: false,
        setConsent: jest.fn(),
        updateContext: jest.fn(),
        authenticate: jest.fn(),
        unauthenticate: jest.fn(),
        fetchFlags: jest.fn(),
        anonymousId: null
      } as any

      updateVisitorData(visitor, 'visitor123', { key: 'value' }, undefined, false)

      expect(visitor.setConsent).toHaveBeenCalledWith(true)
      expect(visitor.fetchFlags).toHaveBeenCalled()
    })

    it('should update complex context objects', () => {
      const visitor = {
        hasConsented: true,
        setConsent: jest.fn(),
        updateContext: jest.fn(),
        authenticate: jest.fn(),
        unauthenticate: jest.fn(),
        fetchFlags: jest.fn(),
        anonymousId: null
      } as any

      const complexContext = {
        userId: 'user123',
        age: 25,
        preferences: { theme: 'dark' },
        tags: ['premium', 'beta']
      }

      updateVisitorData(visitor, 'visitor123', complexContext as any, true, false)

      expect(visitor.updateContext).toHaveBeenCalledWith(complexContext)
      expect(visitor.fetchFlags).toHaveBeenCalled()
    })
  })
})
