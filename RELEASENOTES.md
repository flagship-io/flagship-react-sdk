# Flagship REACT SDK - Release notes

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
