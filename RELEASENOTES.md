# Flagship REACT SDK - Release notes

## ➡️ Version 1.3.0

### Breaking changes ⚠️

-   `config` prop is not supported anymore.

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
