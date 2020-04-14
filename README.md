![Flagship logo](src/assets/img/flagshipLogo.jpg)

# Flagship - REACT SDK

React Flagship SDK provides a `<FlagshipProvider />`, which makes Flagship features available to the rest of your app.
Flagship features are accessible using Flagship hooks, have a look to the documentation for details.

### Prerequisites

- **Node.js**: version 6.0.0 or later...

- **Npm**: version 5.2.0 or later...

- **React**: version 16.8.0 or later... (This SDK supports only hooks for now)

## Good to know

<ul style="line-height:1.4;">
- Typescript supported ✅
</ul>

<ul style="line-height:1.4;">
- Small demo app in the <b>example</b> folder but more to come soon! 👨‍💻
</ul>

## Getting Started

1. **Install** the node module:

```
npm install @flagship.io/react-sdk
```

2. **Import** the Flagship React provider at the root level of your app like `App.js` file :

```
import React from "react";
import { FlagshipProvider } from "@flagship.io/react-sdk";

const App = () => (
  <>
    <FlagshipProvider
    >
      {/* [...] */}
    </FlagshipProvider>
  </>
);
```

3. **Initialize** the provider with at least required props such as `envId`, `visitorData` :

```
import React from "react";
import { FlagshipProvider } from "@flagship.io/react-sdk";

const App = () => (
  <>
    <FlagshipProvider
      envId="bn1ab7m56qolupi5sa0g"
      visitorData={{
        id: "test-visitor-id",
        context: {},
      }}
      config={{
        fetchNow: true,
        enableConsoleLogs: true,
      }}
    >
      {/* [...] */}
    </FlagshipProvider>
  </>
);
```

4. Use a Flagship hook in a component. In most case, you'll want to have modifications in cache :

```
import React from 'react';
import { useFsModificationsCache } from "@flagship.io/react-sdk";

export const MyReactComponent = () => {
  const fsModifications = useFsModificationsCache([
    {
      key: "backgroundColor",
      defaultValue: "green",
      activate: false,
    },
  ]);
  return (
      <div
        style={{
          height: "200px",
          width: "200px",
          backgroundColor: fsModifications.backgroundColor,
        }}
      >
        {"I'm a square with color=" + fsModifications.backgroundColor}
      </div>
  )
}
```

## FlagshipProvider Props

This is all available props which you can use inside the `FlagshipProvider` react component:

<table class="table table-bordered table-striped">
    <thead>
    <tr>
        <th style="width: 100px;">Props</th>
        <th style="width: 50px;">Type</th>
        <th style="width: 50px;">Default</th>
        <th>Description</th>
    </tr>
    </thead>
    <tbody>
        <tr>
          <td>envId</td>
          <td>string</td>
          <td>*required*</td>
          <td>Your Flagship environment id.</td>
        </tr>
         <tr>
          <td>visitorData</td>
          <td>object</td>
          <td>*required*</td>
          <td>This is the data to identify the current visitor using your app.<br>The visitorData object takes the following attributes:
           <table> 
              <tbody><tr>
                  <th style="width:25%">Argument</th>
                  <th style="width:10%">Type</th>
                  <th>Description</th>
                </tr>  
                <tr>
                  <td><em>id</em></td>
                  <td><em>string</em></td>
                  <td>Required. The id of the visitor</td>
                </tr>
                <tr>
                  <td><em>context</em></td>
                  <td><em>object</em></td>
                  <td>Optional. Your Flagship visitor context.<br>You'll set inside attributes which should match those defined in your campaigns.
                  </td>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td>config</td>
          <td>object</td>
          <td>{}</td>
          <td>This is the settings of the SDK. It takes an object which has the same shape as the <a href='https://github.com/abtasty/flagship-js-sdk#sdk-settings'>JS SDK settings</a>. Go have a look.</td>
        </tr>
        <tr>
          <td>onInitStart</td>
          <td>function</td>
          <td>null</td>
          <td>Callback function called when the SDK starts initialization.</td>
        </tr>
        <tr>
          <td>onInitDone</td>
          <td>function</td>
          <td>null</td>
          <td>Callback function called when the SDK ends initialization.</td>
        </tr>
        <tr>
          <td>modifications</td>
          <td>object</td>
          <td>null</td>
          <td>This is an object which has the shape of Flagship modifications as it is return from the Flagship API.<br>Can be useful when you already manually fetched the data before.<br>From there, the SDK will save this data provided in cache and won't fetch anything.</td>
        </tr>
        <tr>
          <td>loadingComponent</td>
          <td>React.ReactNode</td>
          <td>null</td>
          <td>This is component which will be render when Flagship is loading.<br>By default, the value is <i>null</i> which means nothing will appear until Flagship is ready.</td>
        </tr>
    </tbody>
</table>

## Flagship Hooks

Here the list of current available hooks:

- [useFsModifications](#useFsModifications)
- [useFsModificationsCache](#useFsModificationsCache)
- [useFsActivate](#useFsActivate)

#### `useFsModifications`

> get the data from the Flagship API and returns Flagship modifications.

**Demo:**

- coming soon

#### `useFsModificationsCache`

> returns Flagship modifications in cache. If the cache is empty, you can expect that it will return nothing.

**Demo:**

- coming soon

#### `useFsActivate`

> return `nothing` (for the moment...)

<table class="table table-bordered table-striped">
    <thead>
    <tr>
        <th style="width: 100px;">argument</th>
        <th style="width: 50px;">type</th>
        <th style="width: 50px;">default</th>
        <th>description</th>
    </tr>
    </thead>
    <tbody>
        <tr>
          <td>modificationKeys</td>
          <td>array(string)</td>
          <td>*required*</td>
          <td>An array of modification key.<br>For each key, a http will be done to trigger the activate of corresponding modification.</td>
        </tr>
    </tbody>
</table>

**Demo:**

- coming soon

## Contributing

Take a look to the [Contributors Guide](CONTRIBUTING.md).

## What is Flagship ?

Have a look [here](https://www.abtasty.com/solutions-product-teams/).

## License

Flagship uses license under the [Apache version 2.0](http://www.apache.org/licenses/).
