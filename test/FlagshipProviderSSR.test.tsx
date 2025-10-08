import React from "react";
import { render, waitFor } from "@testing-library/react";
import { FlagshipProviderSSR } from "../src/FlagshipProviderSSR";
import Flagship, { DecisionMode, FSSdkStatus } from "@flagship.io/js-sdk";
import { FlagshipProvider } from "../src/FlagshipProvider";

// Mock the Flagship SDK
jest.mock("@flagship.io/js-sdk", () => {
  const mockVisitor = {
    fetchFlags: jest.fn().mockResolvedValue(undefined),
    getFlags: jest.fn().mockReturnValue({
      toJSON: jest.fn().mockReturnValue({ flag1: "value1" }),
    }),
  };

  const Flagship = {
    start: jest.fn().mockResolvedValue(undefined),
    getStatus: jest.fn().mockReturnValue("SDK_INITIALIZED"),
    newVisitor: jest.fn().mockReturnValue(mockVisitor),
  };

  return {
    __esModule: true,
    default: Flagship,
    Flagship,
    DecisionMode: {
      DECISION_API: "DECISION_API",
    },
    FSSdkStatus: {
      SDK_NOT_INITIALIZED: "SDK_NOT_INITIALIZED",
      SDK_INITIALIZING: "SDK_INITIALIZING",
      SDK_INITIALIZED: "SDK_INITIALIZED",
    },
  };
});

// Mock the FlagshipProvider component
jest.mock("../src/FlagshipProvider", () => ({
  FlagshipProvider: jest
    .fn()
    .mockImplementation(({ children }) => <div>{children}</div>),
}));

describe("FlagshipProviderSSR", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize the SDK with correct parameters", async () => {
    const envId = "env-id";
    const apiKey = "api-key";
    (Flagship.getStatus as jest.Mock).mockReturnValueOnce(
      "SDK_NOT_INITIALIZED"
    );
    const config = {
      decisionMode: DecisionMode.DECISION_API,
      hitDeduplicationTime: 2,
      fetchNow: false,
    };
    const visitorData = {
      id: "visitor-id",
      hasConsented: true,
      context: { key: "value" },
    };

    const props = {
      ...config,
      envId,
      apiKey,
      children: <div>Test</div>,
      visitorData,
      initialFlagsData: [],
      loadingComponent: <div>Loading</div>,
      onSdkStatusChanged: jest.fn(),
      onBucketingUpdated: jest.fn(),
      fetchFlagsOnBucketingUpdated: true,
      sdkVersion: "1.0.0",
      onFlagsStatusChanged: jest.fn(),
      shouldSaveInstance: true,
    };

    render(await FlagshipProviderSSR(props));

    await waitFor(() => {
      expect(FlagshipProvider).toHaveBeenCalledTimes(1);
      expect(FlagshipProvider).toHaveBeenNthCalledWith(
        1,
        {
          ...props,
          language: 1,
        },
        expect.anything()
      );
    });

    expect(Flagship.start).toHaveBeenCalledWith(
      envId,
      apiKey,
      expect.objectContaining(config)
    );
  });

  it("should not re-initialize the SDK if already initialized", async () => {
    const visitorData = {
      id: "visitor-id",
      hasConsented: true,
      context: { key: "value" },
    };

    render(
      await FlagshipProviderSSR({
        envId: "env-id",
        apiKey: "api-key",
        visitorData,
        children: <div>Test</div>,
        initialCampaigns: [],
      })
    );

    expect(Flagship.start).not.toHaveBeenCalled();
  });

  it("should create a visitor and fetch flags when no initialFlagsData is provided", async () => {
    const visitorData = {
      id: "visitor-id",
      context: { key: "value" },
      isAuthenticated: true,
      hasConsented: true,
    };

    render(
      await FlagshipProviderSSR({
        envId: "env-id",
        apiKey: "api-key",
        visitorData,
        children: <div>Test</div>,
      })
    );

    expect(Flagship.newVisitor).toHaveBeenCalledWith(
      expect.objectContaining({
        visitorId: visitorData.id,
        context: visitorData.context,
        isAuthenticated: visitorData.isAuthenticated,
        hasConsented: visitorData.hasConsented,
      })
    );

    const mockVisitor = (Flagship.newVisitor as jest.Mock).mock.results[0]
      .value;
    expect(mockVisitor.fetchFlags).toHaveBeenCalled();
    expect(mockVisitor.getFlags).toHaveBeenCalled();
  });

  it("should not fetch flags when initialFlagsData is provided", async () => {
    render(
      await FlagshipProviderSSR({
        envId: "env-id",
        apiKey: "api-key",
        visitorData: { id: "visitor-id", hasConsented: true },
        initialFlagsData: [],
        children: <div>Test</div>,
      })
    );

    expect(Flagship.newVisitor).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(FlagshipProvider).toHaveBeenCalledTimes(1);
      expect(FlagshipProvider).toHaveBeenCalledWith(
        expect.objectContaining({
          initialFlagsData: [],
        }),
        expect.anything()
      );
    });
  });

  it("should not fetch flags when initialCampaigns is provided", async () => {
    render(
      await FlagshipProviderSSR({
        envId: "env-id",
        apiKey: "api-key",
        visitorData: { id: "visitor-id", hasConsented: true },
        initialCampaigns: [],
        children: <div>Test</div>,
      })
    );

    expect(Flagship.newVisitor).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(FlagshipProvider).toHaveBeenCalledTimes(1);
      expect(FlagshipProvider).toHaveBeenCalledWith(
        expect.objectContaining({
          initialCampaigns: [],
        }),
        expect.anything()
      );
    });
  });
});
