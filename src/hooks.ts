'use client';
import { useRef, useEffect } from "react";
import { Visitor, primitive } from "./deps";


export function useLatestRef<T>(value: T) {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref;
}


export function shouldRecreateVisitor(
  currentVisitor: Visitor | undefined,
  visitorId: string,
  isAuthenticated: boolean | undefined,
): boolean {
  if (!currentVisitor) {
    return true;
  }

  const hasIdChanged = currentVisitor.visitorId !== visitorId;
  
  return hasIdChanged && (!isAuthenticated || (isAuthenticated && !!currentVisitor.anonymousId));
}


export function shouldUpdateConsent(
  currentVisitor: Visitor,
  hasConsented: boolean | undefined,
): boolean {
  return currentVisitor.hasConsented !== hasConsented;
}


export function getAuthenticationAction(
  currentVisitor: Visitor,
  isAuthenticated: boolean | undefined,
): "authenticate" | "unauthenticate" | null {
  if (!currentVisitor.anonymousId && isAuthenticated) {
    return "authenticate";
  }
  if (currentVisitor.anonymousId && !isAuthenticated) {
    return "unauthenticate";
  }
  return null;
}


export function updateVisitorData(
  visitor: Visitor,
  visitorId: string,
  context: Record<string, primitive>,
  hasConsented: boolean | undefined,
  isAuthenticated: boolean | undefined,
): void {
  if (shouldUpdateConsent(visitor, hasConsented)) {
    visitor.setConsent(hasConsented ?? true);
  }

  visitor.updateContext(context);

  const authAction = getAuthenticationAction(visitor, isAuthenticated);
  if (authAction === "authenticate") {
    visitor.authenticate(visitorId);
  } else if (authAction === "unauthenticate") {
    visitor.unauthenticate();
  }

  visitor.fetchFlags();
}
