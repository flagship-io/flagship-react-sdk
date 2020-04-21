![Flagship logo](src/assets/img/flagshipLogo.jpg)

# Flagship - REACT SDK

React Flagship SDK provides a `<FlagshipProvider />`, which makes Flagship features available to the rest of your app.
Flagship features are accessible using Flagship hooks, have a look to the documentation for details.

### Prerequisites

-   **Node.js**: version 6.0.0 or later...

-   **Npm**: version 5.2.0 or later...

-   **React**: version 16.8.0 or later... (This SDK supports only hooks for now)

## Good to know

<ul style="line-height:1.4;">
- Typescript supported ✅
</ul>

<ul style="line-height:1.4;">
- Small <a href="https://abtasty.github.io/flagship-react-sdk/">dev demo app</a> but more to come soon! 👨‍💻
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
    <FlagshipProvider>
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
import { useFsModifications } from "@flagship.io/react-sdk";

export const MyReactComponent = () => {
  const fsModifications = useFsModifications([
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
          <td>This is the settings of the SDK. It takes an object which is the same shape as the <a href='https://github.com/abtasty/flagship-js-sdk#sdk-settings'>JS SDK settings</a>. Go have a look, there are many options. 🙂</td>
        </tr>
        <tr>
          <td>onInitStart</td>
          <td>function():void</td>
          <td>null</td>
          <td>Callback function called when the SDK starts initialization.</td>
        </tr>
        <tr>
          <td>onInitDone</td>
          <td>function():void</td>
          <td>null</td>
          <td>Callback function called when the SDK ends initialization.</td>
        </tr>
        <tr>
          <td>onUpdate</td>
          <td>function():void</td>
          <td>null</td>
          <td>Callback function called when the SDK is updated. For example, after a synchronize is triggered or visitor context has changed.</td>
        </tr>
        <tr>
          <td>onSavingModificationsInCache</td>
          <td>function(obj):void</td>
          <td>null</td>
          <td>Callback function called when the SDK is saving modifications in cache.  
          <br>It has an argument which has the following shape:
          <table> 
              <tbody><tr>
                  <th style="width:25%">Key/Property</th>
                  <th>Description</th>
                </tr>  
                <tr>
                  <td><em>modifications</em></td>
                  <td>It is an object which contains modifications <i>past</i> and <i>future</i> computed modifications. 
                  <br>
                   <table> 
              <tbody><tr>
                  <th style="width:25%">Key/Property</th>
                  <th>Description</th>
                </tr>  
                <tr>
                  <td><em>before</em></td>
                  <td>Modificaitons previously in cache.</td>
                </tr>
                  <td><em>after</em></td>
                  <td>New modificaitons which are about to be saved in cache.</td>
              </tbody>
            </table>
            </td>
                </tr>
                <tr>
                  <td><em>saveInCacheModifications</em></td>
                  <td>This is a function which you'll have to call if you want to override the modifications which will be saved in the SDK cache.<br>
                  It has one argument which the modifications that you want to override.<br>If you leave it undefined, it will keep default behavior.</td>
                </tr>
                  <tr>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td>defaultModifications</td>
          <td>object</td>
          <td>null</td>
          <td>This is an object which has the shape of Flagship modifications as it is return from the Flagship API.<br>Can be useful when you already manually fetched the data before or you have your own cache.<br>Providing this props avoid the SDK to have an empty cache during first initialization.<br>The default modifications provided will be override once the SDK finish to fetch Flagship API with an initialization or a synchronization.</td>
        </tr>
        <tr>
          <td>loadingComponent</td>
          <td>React.ReactNode</td>
          <td>undefined</td>
          <td>This is component which will be render when Flagship is loading on <b>first initialization</b> only.<br>By default, the value is <i>undefined</i> which means it will display your app and it might display default modifications value for a very short moment.</td>
        </tr>
    </tbody>
</table>

## Flagship Hooks

Here the list of current available hooks:

-   [useFlagship](#useFlagship)
-   [useFsModifications](#useFsModifications)
-   [useFsActivate](#useFsActivate)
-   [useFsSynchronize](#useFsSynchronize)

#### `useFlagship`

Most used hook from the Flagship React SDK. Through this hook, you can access to modifications of your current visitor and have an access to the SDK status.

> returns an object (Typescript: UseFlagshipOutput)

<table class="table table-bordered table-striped">
    <thead>
    <tr>
        <th style="width: 100px;">Argument</th>
        <th style="width: 50px;">Type</th>
        <th style="width: 50px;">Default</th>
        <th>description</th>
    </tr>
    </thead>
    <tbody>
        <tr>
          <td>params</td>
          <td>object (TS:UseFlagshipOutput)</td>
          <td>*required*</td>
          <td>Contains further required nodes. See the shape of this object  <a href='README.md#useFlagship-parameters'>just below</a>.</td>
        </tr>
    </tbody>
</table>

##### `useFlagship parameters`

<table class="table table-bordered table-striped">
    <thead>
    <tr>
        <th style="width: 100px;">Argument</th>
        <th style="width: 50px;">Type</th>
        <th>description</th>
    </tr>
    </thead>
    <tbody>
        <tr>
          <td>modifications</td>
          <td>Object</td>
          <td>Node param to specify flagship modifications:
            <table> 
              <tbody><tr>
                  <th style="width:25%">Argument</th>
                  <th>Description</th>
                </tr>  
                <tr>
                  <td><em>requested</em></td>
                  <td>Required. An array of object for each modifications and follow this shape:
                   <table> 
              <tbody><tr>
                  <th style="width:25%">Argument</th>
                  <th>Description</th>
                </tr>  
                <tr>
                  <td><em>key</em></td>
                  <td>Required. The name of the modification.</td>
                </tr>
                <tr>
                  <td><em>defaultValue</em></td>
                  <td>Required. The default value if no value for this modification is found.</td>
                </tr>
                  <tr>
                  <td><em>activate</em></td>
                  <td>Optional. </td>
                </tr>
              </tbody>
            </table>
                  </td>
                </tr>
                  <tr>
                  <td><em>activateAll</em></td>
                  <td>Optional. The value is <i>false</i> by default</td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td>status</td>
          <td>Object</td>
            <td>Gives you some informations about SDK current sate:
          <table> 
              <tbody><tr>
                  <th style="width:25%">Key/Property</th>
                  <th>Description</th>
                </tr>  
                <tr>
                  <td><em>isLoading</em></td>
                  <td>If true, the SDK it not ready, false otherwise.
            </td>
                </tr>
                <tr>
                  <td><em>lastRefresh</em></td>
                  <td>Date cast string with ISO format.<br>This is the date corresponding to the most recent moment where modifications were saved in cache.</td>
                </tr>
                  <tr>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
    </tbody>
</table>

#### `useFsModifications`

This will give you the modification saved in the SDK cache.

**NOTE:** If the SDK cache is empty, you can expect that it will return nothing.

> returns Flagship modifications

<table class="table table-bordered table-striped">
    <thead>
    <tr>
        <th style="width: 100px;">Argument</th>
        <th style="width: 50px;">Type</th>
        <th style="width: 50px;">Default</th>
        <th>description</th>
    </tr>
    </thead>
    <tbody>
        <tr>
          <td>modificationsRequested</td>
          <td>Array(object)</td>
          <td>*required*</td>
          <td>List of all modifications you're looking for. Each element of the array follow this object structure:
            <table> 
              <tbody><tr>
                  <th style="width:25%">Argument</th>
                  <th>Description</th>
                </tr>  
                <tr>
                  <td><em>key</em></td>
                  <td>Required. The name of the modification.</td>
                </tr>
                <tr>
                  <td><em>defaultValue</em></td>
                  <td>Required. The default value if no value for this modification is found.</td>
                </tr>
                  <tr>
                  <td><em>activate</em></td>
                  <td>Optional. </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td>activateAllModifications</td>
          <td>Boolean</td>
          <td>false</td>
          <td>If set to true, all modifications will be activated. If set to false, none will be activated.
          <br>Be aware that if this argument is set, the attribute <i>activate</i> set in each element of array <b>modificationsRequested</b> will be ignored.</td>
        </tr>
    </tbody>
</table>

**Demo:**

-   coming soon

#### `useFsActivate`

> return `void`

<table class="table table-bordered table-striped">
    <thead>
    <tr>
        <th style="width: 100px;">Argument</th>
        <th style="width: 50px;">Type</th>
        <th style="width: 50px;">Default</th>
        <th>description</th>
    </tr>
    </thead>
    <tbody>
        <tr>
          <td>modificationKeys</td>
          <td>Array(string)</td>
          <td>*required*</td>
          <td>An array of modification key.<br>For each key, a http will be done to trigger the activate of corresponding modification.</td>
        </tr>
         <tr>
          <td>applyEffectScope</td>
          <td>Array(string)</td>
          <td>[]</td>
          <td>This argument has same behavior as React.useEffect (2nd argument) hook. It will listen values inside array and trigger a synchronize if one them has changed. By default it is trigger once, during React component where it's used, did mount.</td>
        </tr>
    </tbody>
</table>

**Demo:**

-   coming soon

#### `useFsSynchronize`

Refresh modifications in cache by making a http request to the Flagship API.

> return `void`

<table class="table table-bordered table-striped">
    <thead>
    <tr>
        <th style="width: 100px;">Argument</th>
        <th style="width: 50px;">Type</th>
        <th style="width: 50px;">Default</th>
        <th>description</th>
    </tr>
    </thead>
    <tbody>
        <tr>
          <td>applyEffectScope</td>
          <td>Array(string)</td>
          <td>[]</td>
          <td>This argument has same behavior as React.useEffect (2nd argument) hook. It will listen values inside array and trigger a synchronize if one them has changed. By default it is trigger once, during React component where it's used, did mount.</td>
        </tr>
         <tr>
          <td>activateAllModifications</td>
          <td>Boolean</td>
          <td>false</td>
          <td>If set to true, all modifications will be activated. If set to false (default behavior), none will be activated.</td>
        </tr>
    </tbody>
</table>

**Demo:**

-   coming soon

## Contributing

Take a look to the [Contributors Guide](CONTRIBUTING.md).

## What is Flagship ?

Have a look [here](https://www.abtasty.com/solutions-product-teams/).

## License

Flagship uses license under the [Apache version 2.0](http://www.apache.org/licenses/).
