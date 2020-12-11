# Flagship REACT SDK - Release notes

## ➡️ Version 2.1.0

In this new release, we are launching **visitor reconciliation** which means that the SDK will adopt specific behavior according the data you'll provide to the visitor (in `visitorData` prop).

### New features 🎉

-   `visitorData` property has a new attribute `isAuthenticated` that takes a boolean and is optional (`false` by default).

**NOTE**: Implementing visitor reconciliation will require to ALWAYS consider wether your visitor is authenticated (`visitorData.isAuthenticated=true`) or anonymous (`visitorData.isAuthenticated=false`)

Here an example:

-   Your visitor arrives on your app for the first time (not authenticated).

    ```javascript
    import React from 'react';
    import { FlagshipProvider } from '@flagship.io/react-sdk';

    const App = () => (
        <>
            <FlagshipProvider
                envId="YOUR_ENV_ID"
                apiKey="YOUR_API_KEY"
                visitorData={{
                    isAuthenticated: false, // <=== Tells the SDK that the visitor is anonymous
                    id: 'VISITOR_ANONYMOUS_ID", // you need to provide an id which will be considered as an anonymous id
                    context: {
                        some: 'value'
                    },
                }}
            >
                {/* [...] */}
            </FlagshipProvider>
        </>
    );
    ```

    The visitor will match some campaigns and receive some modifications.

-   Now, the visitor is logging in. No problem, we need to update the `visitorData` accordingly to tell the SDK about those changes:

    ```javascript
    import React from 'react';
    import { FlagshipProvider } from '@flagship.io/react-sdk';

    const App = () => (
        <>
            <FlagshipProvider
                envId="YOUR_ENV_ID"
                apiKey="YOUR_API_KEY"
                visitorData={{
                    isAuthenticated: true, // <=== Tells the SDK that the visitor is no more anonymous !
                    id: 'ID_OF_RECOGNIZED_VISITOR', // Put a new id here so that it will reconciliated with the previous (anonymous) session.
                    context: {
                        // some context, can be updated accordingly
                    }
                }}
            >
                {/* [...] */}
            </FlagshipProvider>
        </>
    );
    ```

    **NOTE**: When switching from `visitorData.isAuthenticated=false` to `visitorData.isAuthenticated=true`, you can still keep the previous value of `visitorData.id` (for example when your visitor has just signed up).

    Great, the visitor will keep its previous (anonymous) experience, meaning that it'll still keep same variations for campaigns that it still match.

-   There is still a possible scenario that can happen. What if the visitor is signing out ? Well.. you'll have to decide between two options:

    1. I want my visitor to keep its anonymous experience as it was before being authenticated.
    2. I want my visitor to be a brand new visitor.

    Process for option #1:

    -   Change the value of `visitorData.isAuthenticated` from `true` to `false`
    -   Make sure `visitorData.id` has the same value as before being authenticate.

    Process for option #2:

    -   Change the value of `visitorData.isAuthenticated` from `true` to `false`
    -   Make sure `visitorData.id` has a new unique value.

## ➡️ Version 2.0.8

### Improvements 💪

-   `onInitStart` and `onInitDone` prop is triggered in a better way.

-   Flagship React SDK is forced to runs synchronously in SSR. We will update [the documentation](https://developers.flagship.io/docs/sdk/react/v2.0) to indicate features available or not in SSR.

### New features 🎉

-   Add universal app demo. [Click here](./examples/react-universal-demo/README.md) to see the source code.

-   Add full ssr app demo. [Click here](./examples/react-ssr-demo/README.md) to see the source code.

## ➡️ Version 2.0.7

### Improvements 💪

-   `onUpdate` prop is triggered in a better way and `status` object is giving more data, have a look to the [documentation](https://developers.flagship.io/docs/sdk/react/v2.0#useflagship-output-status) for full details.

### Bug fixes 🐛

## ➡️ Version 2.0.6

-   `fetchNow` prop was not true by default.

### Bug fixes 🐛

-   Safe mode side effects still processing even if `enableSafeMode` is falsy. Not anymore.

-   Fix rendering issue, not immediately considering modifications from `initialModifications`, when it's set.

## ➡️ Version 2.0.5

-   Minor change.

## ➡️ Version 2.0.4

### Bug fixes 🐛

-   Fix Flagship decision API V2 which was not used when `apiKey` props is defined.

-   Fix `loadingComponent` not ignored when `fetchNow` is set to `false`.

### Breaking changes ⚠️

-   `fetchNow` prop is now `true` by default.

## ➡️ Version 2.0.3

-   Minor change.

## ➡️ Version 2.0.2

### New features 🎉

-   New optimization when sending activate calls. The visitor instance in the SDK is updated instead of being recreated from scratch.

## ➡️ Version 2.0.1

### New features 🎉

-   Panic mode supported. When you've enabled panic mode through the web dashboard, the SDK will detect it and be in safe mode. Logs will appear to warns you and default values for modifications will be return.

-   `timeout` setting added. It specify the timeout duration when fetching campaigns via API mode (`decisionMode = "API"`), defined in **seconds**. Minimal value should be greater than 0. More to come on this setting soon...

### Breaking changes ⚠️

-   `pollingInterval` setting is now a period interval defined in **seconds** (not minutes). Minimal value is 1 second.

## ➡️ Version 2.0.0

### New features 🎉

-   Add `initialBucketing` prop. It takes the data received from the flagship bucketing api endpoint. Can be useful when you save this data in cache.

-   Add `onBucketingSuccess` and `onBucketingFail` callback props. Those callbacks are called after a bucketing polling has either succeed or failed.

    Example:

    ```javascript
    <FlagshipProvider
        /* [...] */
        onBucketingSuccess={(bucketingData) => {
            // shape of bucketingData: { status: string; payload: BucketingApiResponse }
            console.log('Bucketing polling succeed with following data: ' + JSON.stringify(bucketingData));
        }}
        onBucketingFail={(error) => {
            console.log('Bucketing polling failed with following error: ' + error);
        }}
    >
        {children}
    </FlagshipProvider>
    ```

-   Add `startBucketingPolling` and `stopBucketingPolling` function available in `useFlagship` hook. It allows to start/stop the bucketing polling whenever you want.

    Example:

    ```javascript
    import { useFlagship } from '@flagship.io/react-sdk';

    const { startBucketingPolling, stopBucketingPolling } = useFlagship();

    // [...]

    return (
        <>
            <Button
                onClick={() => {
                    const { success, reason } = startBucketingPolling();
                    if (!success) {
                        console.log('startBucketingPolling failed because ' + reason);
                    } else {
                        console.log('bucketing starts !');
                    }
                }}
            >
                Start the bucketing
            </Button>
            <Button
                onClick={() => {
                    const { success, reason } = stopBucketingPolling();
                    if (!success) {
                        console.log('stopBucketingPolling failed because ' + reason);
                    } else {
                        console.log('bucketing stops !');
                    }
                }}
            >
                Stop the bucketing
            </Button>
        </>
    );
    ```

### Bug fixes 🐛

-   Bucketing is stopped automatically when value of `decisionMode` changes dynamically from `"Bucketing"` to another value.

-   When bucketing enabled, fix event's http request sent twice.

### Breaking changes #1 ⚠️

Due to bucketing optimization, the bucketing allocate a variation to a visitor differently than SDK v1.3.X

-   As a result, assuming you have campaign with the following traffic allocation:

    -   50% => `variation1`
    -   50% => `variation2`

    By upgrading to this version, you might see your visitor switching from `variation1` to `variation2` and vice-versa.

### Breaking changes #2 ⚠️

Be aware that `apiKey` will be mandatory in the next major release as it will use the [Decision API v2](http://developers.flagship.io/api/v2/).

-   Make sure to initialize your `FlagshipProvider` component is set correctly:

    -   **BEFORE**:

    ```javascript
        <FlagshipProvider
            envId="YOUR_ENV_ID"
            visitorData={{
                id: 'YOUR_VISITOR_ID',
                context: {}
            }}
        >
    ```

    -   **NOW**:

    ```javascript
        <FlagshipProvider
            envId="YOUR_ENV_ID"
            visitorData={{
                id: 'YOUR_VISITOR_ID',
                context: {}
            }}
            apiKey="YOUR_API_KEY" // <== Required in next major release
        >
    ```

### Breaking changes #3 ⚠️

-   `getModificationInfo` attribute from `useFlagship` hook, is now always defined:

    -   **BEFORE**:

        ```javascript
        import { useFlagship } from '@flagship.io/react-sdk';

        const { getModificationInfo } = useFlagship();

        // [...]

        return (
            <>
                <Button
                    onClick={() => {
                        if (getModificationInfo) {
                            console.log('Flagship SDK not ready !');
                        } else {
                            getModificationInfo(/* args... */).then((data) => {
                                if (data === null) {
                                    console.log('getModificationInfo returns no data');
                                } else {
                                    console.log('getModificationInfo returns: ' + data);
                                }
                            });
                        }
                    }}
                >
                    Get the modification informations
                </Button>
            </>
        );
        ```

    -   **NOW**:

        ```javascript
        import { useFlagship } from '@flagship.io/react-sdk';

        const { getModificationInfo } = useFlagship();

        // [...]

        return (
            <>
                <Button
                    onClick={() => {
                        getModificationInfo(/* args... */).then((data) => {
                            if (data === null) {
                                console.log('getModificationInfo returns no data');
                            } else {
                                console.log('getModificationInfo returns: ' + data);
                            }
                        });
                    }}
                >
                    Get the modification informations
                </Button>
            </>
        );
        ```

### Breaking changes #5 ⚠️

-   `useFsSynchronize` has been removed. Campaigns synchronization is now handle using `useFlagship` hook:

    -   **BEFORE**:

        ```jsx
        import { useFsSynchronize } from '@flagship.io/react-sdk';

        var activateAllModifications = false;

        useFsSynchronize([listenedValue], activateAllModifications); // when "listenedValue" changes, it triggers a synchronize

        // [...]

        return (
            <>
                <Button
                    onClick={() => {
                        // [...] (Update the value of "listenedValue" )
                    }}
                >
                    Test
                </Button>
            </>
        );
        ```

    -   **NOW**:

        ```jsx
        import { useFlagship } from '@flagship.io/react-sdk';

        var activateAllModifications = false;

        const { synchronizeModifications } = useFlagship();

        // [...]

        return (
            <>
                <Button
                    onClick={() => {
                        synchronizeModifications(activateAllModifications)
                            .then((statusCode) => {
                                if (statusCode < 300) {
                                    // Notify success...
                                } else {
                                    // Notify failure...
                                }
                            })
                            .catch((error) => {
                                // Notify error...
                            });
                    }}
                >
                    Trigger a synchronize
                </Button>
            </>
        );
        ```

### Breaking changes #6 ⚠️

-   `pollingInterval` setting is now a period interval defined in **seconds** (not minutes). Minimal value is 1 second.

## ➡️ Version 1.3.1

### Bug fixes 🐛

-   Fix timestamp displayed in logs.

## ➡️ Version 1.3.0

### Breaking changes ⚠️

-   `config` prop is not supported anymore. Currently deprecated and will be deleted in next major release.

### New features 🎉

-   Now supports Bucketing behavior:
    -   `decisionMode` prop added, value is either "API" or "Bucketing".
    -   `pollingInterval` prop added, value is a number. Must be specified when `decisionMode=Bucketing`.

## ➡️ Version 1.2.2

### Bug fixes 🐛

-   Fixed getModificationInfo always returning an error.

## ➡️ Version 1.2.1

### Bug fixes 🐛

-   Minor log fix when sending hits.

## ➡️ Version 1.2.0

### Breaking changes ⚠️

-   When sending a hit "Item", the attribute `ic`(="item code") is now **required** (was optional before). If you do not specify it, the hit won't be send and an error log will be display.

### New features 🎉

-   `onUpdate` prop's first argument, has a new attribute `config`. It gives you ability to check current React SDK config during an update.

## ➡️ Version 1.1.0

### New features 🎉

-   useFlagship hook now returns a new node `getModificationInfo`.

### Breaking changes ⚠️

-   Safe mode is now disable by default because we're working on some improvements. You can still give it a try by enabling it with:

```
<FlagshipProvider
    enableSafeMode={true}
/>
```

-   `config` props is now deprecated and will be deleted in the next major release. All attributes are now directly plugged as a FlagshipProvider's props.

For example:

```
<FlagshipProvider
    config={{fetchNow: true, enableConsoleLogs: false}}
/>
```

is now:

```
<FlagshipProvider
    fetchNow={true}
    enableConsoleLogs={false}
/>
```

## ➡️ Version 1.0.1

-   Jumped version.

## ➡️ Version 1.0.0

-   Release version.
