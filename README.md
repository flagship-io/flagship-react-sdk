![Flagship logo](src/assets/img/flagshipLogo.jpg)

# Flagship - REACT SDK

React Flagship SDK provides a `<FlagshipProvider />`, which makes Flagship features available to the rest of your app.
Flagship features are accessible using Flagship hooks, have a look to the documentation for details.

## Prerequisites

-   **Node.js**: version 6.0.0 or later...

-   **Npm**: version 5.2.0 or later...

-   **React**: version 16.8.0 or later... (This SDK supports only hooks for now)

## Good to know

<ul style="line-height:1.4;">
- Typescript supported ✅
</ul>

<ul style="line-height:1.4;">
- <a href='https://bundlephobia.com/result?p=@flagship.io/react-sdk'>Light weight SDK 🏋</a>  <span style="color: gray;">(Gzipped size=13.3kB~)</span>
</ul>

<ul style="line-height:1.4;">
- Safe mode ✅ (= your app won't crash if SDK fails unexpectedly) 
</ul>

<ul style="line-height:1.4;">
- <a href="https://abtasty.github.io/flagship-react-sdk/">Demo app</a> specially for developers ! 👨‍💻 <a href='examples/react-dev-demo/README.md'>(Details)</a>
</ul>

<ul style="line-height:1.4;">
- <a href="https://react-ecommerce-demo.internal.flagship.io/">Ecommerce app</a> (with SSR) to see the SDK in pratice ! <a href='examples/react-ecommerce-demo/README.md'>(Details)</a>
</ul>

<ul style="line-height:1.4;">
- <a href='./RELEASENOTES.md'>Release notes</a> available to stay in touch 👍
</ul>

# Getting Started

## 1. **Install** the node module:

```
npm install @flagship.io/react-sdk
```

## 2. **Import** the Flagship React provider:

In most of case, you want to wrap all your app with this provider, so you might put it in your `App.js` file.

```
import React from 'react';
import { FlagshipProvider } from '@flagship.io/react-sdk';

const App = () => (
    <>
        <FlagshipProvider>{/* [...] */}</FlagshipProvider>
    </>
);
```

## 3. **Initialize** the provider:

You must put at least required props such as `envId`, `visitorData`.

```
import React from 'react';
import { FlagshipProvider } from '@flagship.io/react-sdk';

const App = () => (
    <>
        <FlagshipProvider
            envId="bn1ab7m56qolupi5sa0g"
            visitorData={{
                id: 'test-visitor-id',
                context: {}
            }}
            config={{
                fetchNow: true,
                enableConsoleLogs: true
            }}
        >
            {/* [...] */}
        </FlagshipProvider>
    </>
);
```

## 4. Use a Flagship hook in a component:

In most case, you will get the desired modifications.

```
import React from 'react';
import { useFsModifications } from '@flagship.io/react-sdk';

export const MyReactComponent = () => {
    const fsModifications = useFsModifications([
        {
            key: 'backgroundColor',
            defaultValue: 'green',
            activate: false
        }
    ]);
    return (
        <div
            style={{
                height: '200px',
                width: '200px',
                backgroundColor: fsModifications.backgroundColor
            }}
        >
            {"I'm a square with color=" + fsModifications.backgroundColor}
        </div>
    );
};
```

# FlagshipProvider Props

## All props

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
                  <td><b>Required</b>. The id of the visitor</td>
                </tr>
                <tr>
                  <td><em>context</em></td>
                  <td><em>object</em></td>
                  <td><b>Optional</b>. Your Flagship visitor context.<br>You'll set inside attributes which should match those defined in your campaigns.
                  </td>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td>config</td>
          <td>object</td>
          <td>{}</td>
          <td>This is the settings of the SDK. It takes an object, the shape is describe <a href='README.md#sdk-prop-settings'>here</a>.</td>
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
          <td>function(object):void</td>
          <td>null</td>
          <td>Callback function called when the SDK is updated. For example, after a synchronize is triggered or visitor context has changed.<br>It has one argument which is an object with has the following shape: <table> 
              <tbody><tr>
                  <th style="width:25%">Key/Property</th>
                  <th>Description</th>
                </tr>  
                <tr>
                  <td><em>fsModifications</em></td>
                  <td>It contains the last modifications saved in cache.
                  </td>
                </tr>
              </tbody>
            </table></td>
        </tr>
        <tr>
          <td>initialModifications</td>
          <td>object</td>
          <td>null</td>
          <td>This is an object which has the shape of Flagship modifications as it is return from the Flagship API.<br>Can be useful when you already manually fetched the data before or you have your own cache.<br>Providing this prop avoid the SDK to have an empty cache during first initialization.<br>The default modifications provided will be overridden whenever the SDK is fetching Flagship API in order to modifications up to date.<br>You can save back the last updated modifications using <i>onUpdate</i> prop callback.</td>
        </tr>
        <tr>
          <td>loadingComponent</td>
          <td>React.ReactNode</td>
          <td>undefined</td>
          <td>This is component which will be render when Flagship is loading on <b>first initialization</b> only.<br>By default, the value is <i>undefined</i> which means it will display your app and it might display default modifications value for a very short moment.</td>
        </tr>
    </tbody>
</table>

## "config" prop

This is all available settings which you can set on the SDK.

Here are the attributes which you can set inside the SDK settings object:

<table class="table table-bordered table-striped">
    <thead>
    <tr>
        <th style="width: 100px;">Argument</th>
        <th style="width: 50px;">Type</th>
        <th style="width: 50px;">Default</th>
        <th>Description</th>
    </tr>
    </thead>
    <tbody>
        <tr>
          <td>fetchNow</td>
          <td>boolean</td>
          <td>false</td>
          <td>Decide to fetch automatically modifications data when creating a new <a href='README.md#flagshipvisitor-class'>FlagshipVisitor</a>.</td>
        </tr>
        <tr>
          <td>activateNow</td>
          <td>boolean</td>
          <td>false</td>
          <td>Decide to trigger automatically the data when creating a new <a href='README.md#flagshipvisitor-class'>FlagshipVisitor</a>.<br><b>NOTE</b>: when set to <i>true</i>, it will implicitly set <i>fetchNow=true</i> as well.</td>
        </tr>
        <tr>
          <td>enableConsoleLogs</td>
          <td>boolean</td>
          <td>false</td>
          <td>Enable it to display logs on the console when SDK is running.<br>This will only display logs such as <i>Warnings</i>, <i>Errors</i>, <i>Fatal errors</i> and <i>Info</i>.</td>
        </tr>
        <tr>
          <td>enableErrorLayout</td>
          <td>boolean</td>
          <td>false</td>
          <td>This is a small layout visible at the bottom of the screen. It is displayed only when an unexpected error occurred in the SDK. By default, it's set to <i>false</i> and if set to <i>true</i>, it will be only visible in a node environment other than <i>production</i>. Here a <a href='./src/assets/img/errorLayout.png'>screenshot</a> to have a look.</td>
        </tr>
        <tr>
          <td>nodeEnv</td>
          <td>string</td>
          <td>'production'</td>
          <td>If value is other than <i>production</i>, it will also display <i>Debug</i> logs.</td>
        </tr>
        <tr>
          <td>flagshipApi</td>
          <td>string</td>
          <td>'https://decision-api.flagship.io/v1/'</td>
          <td>
          This setting can be useful in further scenario:<br>
          - If you need to mock the API for tests such as end to end.<br>
          - If you want to move to an earlier version the Flagship API (v2, v3,...).
          </td>
        </tr>
        <tr>
          <td>apiKey</td>
          <td>string</td>
          <td>null</td>
          <td>If you want to use the <a href="http://developers.flagship.io/api/v2/">Decision API V2</a>, you must contact the support team so they'll provide you an API Key to authenticate the calls.</td>
        </tr>
</tbody>

</table>

# Flagship Hooks

## Summary

Here the list of current available hooks:

-   [useFlagship](#useFlagship)
-   [useFsModifications](#useFsModifications)
-   [useFsActivate](#useFsActivate)
-   [useFsSynchronize](#useFsSynchronize)

## Available hits

-   [Transaction Hit](#transaction-hit)
-   [Screen Hit](#screen-hit)
-   [Item Hit](#item-hit)
-   [Event Hit](#event-hit)

## `useFlagship`

Most used hook from the Flagship React SDK. Through this hook, you can access to modifications of your current visitor and have an access to the SDK status. Output shape is visible [here](#useFlagship-output-shape).

-   returns an object (Typescript: UseFlagshipOutput)

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
          <td>options</td>
          <td>object (TS:UseFlagshipParams)</td>
          <td>See the shape of options param,  <a href='README.md#useFlagship-options'>just below</a>.</td>
        </tr>
    </tbody>
</table>

### `useFlagship options`

<table class="table table-bordered table-striped">
    <thead>
    <tr>
        <th style="width: 100px;">Key/Property</th>
        <th style="width: 50px;">Type</th>
        <th>description</th>
    </tr>
    </thead>
    <tbody>
        <tr>
          <td>modifications</td>
          <td>object</td>
          <td>Node param to specify flagship modifications:
            <table> 
              <tbody><tr>
                  <th style="width:25%">Argument</th>
                  <th>Description</th>
                </tr>  
                <tr>
                  <td><em>requested</em></td>
                  <td><b>Required</b>. An array of object for each modifications and follow this shape:
                   <table> 
              <tbody><tr>
                  <th style="width:25%">Argument</th>
                  <th>Description</th>
                </tr>  
                <tr>
                  <td><em>key</em></td>
                  <td><b>Required</b>. The name of the modification.</td>
                </tr>
                <tr>
                  <td><em>defaultValue</em></td>
                  <td><b>Required</b>. The default value if no value for this modification is found.</td>
                </tr>
                  <tr>
                  <td><em>activate</em></td>
                  <td><b>Optional</b>. </td>
                </tr>
              </tbody>
            </table>
                  </td>
                </tr>
                  <tr>
                  <td><em>activateAll</em></td>
                  <td><b>Optional</b>. The value is <i>false</i> by default</td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
    </tbody>
</table>

### `useFlagship output shape`

<table class="table table-bordered table-striped">
    <thead>
    <tr>
        <th style="width: 100px;">Key/Property</th>
        <th style="width: 50px;">Type</th>
        <th>description</th>
    </tr>
    </thead>
    <tbody>
        <tr>
          <td>modifications</td>
          <td>object</td>
          <td>An <i>object</i> where each key is a modification with corresponding value
          </td>
        </tr>
        <tr>
          <td>hit</td>
          <td>object</td>
             <td>Gives you some functions to send one or further hits:
          <table> 
              <tbody><tr>
                  <th style="width:25%">Key/Property</th>
                  <th>Description</th>
                </tr>  
                <tr>
                  <td><em>send</em></td>
                  <td>Takes an object as parameter. The object must follow a <a href='#Shape-of-possible-hits-to-send'>hit shape</a>.
            </td>
                </tr>
                <tr>
                  <td><em>sendMultiple</em></td>
                <td>Takes an array of object as parameter. Each object must follow a <a href='#Shape-of-possible-hits-to-send'>hit shape</a>. You can mix different hit shape within the array.
         </tr>
                  <tr>
                </tr>
              </tbody>
            </table> </td>
        </tr>
        <tr>
          <td>status</td>
          <td>object</td>
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

> **Demo:**

```
import { useFlagship } from '@flagship.io/react-sdk';

const fsParams = {
    modifications: {
        requested: [
            {
                key: 'btnColor',
                defaultValue: 'green',
                activate: false
            }
        ]
    }
}

const {
    modifications: fsModifications,
    status: fsStatus,
    hit: fsHit,
} = useFlagship(fsParams);
```

> **Demo 2:**

```
import { useFlagship } from '@flagship.io/react-sdk';

const { hit: fsHit } = useFlagship();

// insider render function:

<Button
    onClick={() => {
        const mockHit = {
            type: 'Transaction',
            data: {
                transactionId: '12451342423',
                affiliation: 'myAffiliation',
                totalRevenue: 999,
                shippingCost: 888,
                shippingMethod: 'myShippingMethod',
                currency: 'myCurrency',
                taxes: 1234444,
                paymentMethod: 'myPaymentMethod',
                itemCount: 2,
                couponCode: 'myCOUPON',
                documentLocation:
                    'http%3A%2F%2Fabtastylab.com%2F60511af14f5e48764b83d36ddb8ece5a%2F',
                pageTitle: 'myScreen'
            }
        };
        fsHit.send(mockHit);
    }}
>
    Send a transaction hit
</Button>
```

## `useFsModifications`

This will give you the modification saved in the SDK cache.

**<b>NOTE</b>:** If the SDK cache is empty, you can expect that it will return nothing.

-   returns Flagship modifications

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
                  <td><b>Required</b>. The name of the modification.</td>
                </tr>
                <tr>
                  <td><em>defaultValue</em></td>
                  <td><b>Required</b>. The default value if no value for this modification is found.</td>
                </tr>
                  <tr>
                  <td><em>activate</em></td>
                  <td><b>Optional</b>. </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td>activateAllModifications</td>
          <td>boolean</td>
          <td>false</td>
          <td>If set to true, all modifications will be activated. If set to false, none will be activated.
          <br>Be aware that if this argument is set, the attribute <i>activate</i> set in each element of array <b>modificationsRequested</b> will be ignored.</td>
        </tr>
    </tbody>
</table>

> **Demo:**

```
import { useFsModifications } from '@flagship.io/react-sdk';

const fsModifications = useFsModifications([
  {
      key: 'btnColor',
      defaultValue: 'green',
      activate: false
  }
]);
```

## `useFsActivate`

-   return `void`

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

> **Demo:**

```
import { useFsActivate } from '@flagship.io/react-sdk';

const [toggle, setToggle] = React.useState(false);

useFsActivate(['btnColor', 'otherKey1', 'otherKey2'], [toggle]); // trigger an activate when "toggle" value change.

// insider render function:

<Button
variant="secondary"
onClick={() => setToggle(!toggle)}
>
    Trigger activate
</Button>
```

## `useFsSynchronize`

Refresh modifications in cache by making a http request to the Flagship API.

-   return `void`

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

> **Demo:**

```
import { useFsSynchronize } from '@flagship.io/react-sdk';

const [toggle, setToggle] = React.useState(false);
const activateAllModifications = false;

useFsSynchronize([toggle], activateAllModifications); // trigger a synchronize when "toggle" value change.

// insider render function:

<Button
variant="secondary"
onClick={() => setToggle(!toggle)}
>
    Trigger synchronize
</Button>
```

# Hits

## Summary

<p id='Shape-of-possible-hits-to-send'><i>Shape</i> of possible hits to send:</p>

-   [Transaction Hit](#transaction-hit)
-   [Screen Hit](#screen-hit)
-   [Item Hit](#item-hit)
-   [Event Hit](#event-hit)

## `Transaction Hit`

<table class="table table-bordered table-striped">
    <thead>
    <tr>
        <th style="width: 100px;">Attribute</th>
        <th style="width: 50px;">Type</th>
        <th>Description</th>
    </tr>
    </thead>
    <tbody>
        <tr>
          <td>transactionId</td>
          <td>string</td>
          <td><b>Required</b>. The id of your transaction.</td>
        </tr>
        <tr>
          <td>affiliation</td>
          <td>string</td>
          <td><b>Required</b>. The name of the KPI that you will have inside your reporting.</td>
        </tr>
        <tr>
          <td>totalRevenue</td>
          <td>number</td>
          <td><b>Optional</b>. Specifies the total revenue associated with the transaction. This value should include any shipping or tax costs.</td>
        </tr>
        <tr>
          <td>shippingCost</td>
          <td>number</td>
          <td><b>Optional</b>. The total shipping cost of your transaction.</td>
        </tr>
        <tr>
          <td>shippingMethod</td>
          <td>string</td>
          <td><b>Optional</b>. The shipping method of your transaction.</td>
        </tr>
        <tr>
          <td>taxes</td>
          <td>number</td>
          <td><b>Optional</b>. Specifies the total tax of your transaction.</td>
        </tr>
        <tr>
          <td>currency</td>
          <td>string</td>
          <td><b>Optional</b>. Specifies the currency of your transaction.<br><b>NOTE</b>: Value should be a valid ISO 4217 currency code.</td>
        </tr>
        <tr>
          <td>paymentMethod</td>
          <td>string</td>
          <td><b>Optional</b>. Specifies the payment method used for your transaction.</td>
        </tr>
        <tr>
          <td>itemCount</td>
          <td>number</td>
          <td><b>Optional</b>. Specifies the number of item of your transaction.</td>
        </tr>
        <tr>
          <td>couponCode</td>
          <td>string</td>
          <td><b>Optional</b>. The coupon code associated with the transaction.</td>
        </tr>
        <tr>
          <td>documentLocation</td>
          <td>string</td>
          <td><b>Optional</b>. Specifies the current URL of the page, at the moment where the hit has been sent.</td>
        </tr>
        <tr>
          <td>pageTitle</td>
          <td>string</td>
          <td><b>Optional</b>. Specifies the name of the page, at the moment where the hit has been sent.</td>
        </tr>
    </tbody>
</table>

## `Screen Hit`

<table class="table table-bordered table-striped">
    <thead>
    <tr>
        <th style="width: 100px;">Attribute</th>
        <th style="width: 50px;">Type</th>
        <th>Description</th>
    </tr>
    </thead>
    <tbody>
        <tr>
          <td>documentLocation</td>
          <td>string</td>
          <td><b>Required</b>. Specifies the current URL of the page, at the moment where the hit has been sent.</td>
        </tr>
        <tr>
          <td>pageTitle</td>
          <td>string</td>
          <td><b>Required</b>. Specifies the name of the page, at the moment where the hit has been sent.</td>
        </tr>
    </tbody>
</table>

## `Item Hit`

<table class="table table-bordered table-striped">
    <thead>
    <tr>
        <th style="width: 100px;">Attribute</th>
        <th style="width: 50px;">Type</th>
        <th>Description</th>
    </tr>
    </thead>
    <tbody>
        <tr>
          <td>transactionId</td>
          <td>string</td>
          <td><b>Required</b>. The id of your transaction.</td>
        </tr>
        <tr>
          <td>name</td>
          <td>string</td>
          <td><b>Required</b>. The name of your item.</td>
        </tr>
        <tr>
          <td>price</td>
          <td>number</td>
          <td><b>Optional</b>. Specifies the price for a single item / unit.</td>
        </tr>
        <tr>
          <td>code</td>
          <td>string</td>
          <td><b>Optional</b>. Specifies the SKU or item code.</td>
        </tr>
        <tr>
          <td>category</td>
          <td>string</td>
          <td><b>Optional</b>. Specifies the category that the item belongs to.
          </td>
        </tr>
        <tr>
          <td>quantity</td>
          <td>number</td>
          <td><b>Optional</b>. Specifies the number of items purchased.
          </td>
        </tr>
        <tr>
          <td>documentLocation</td>
          <td>string</td>
          <td><b>Optional</b>. Specifies the current URL of the page, at the moment where the hit has been sent.</td>
        </tr>
        <tr>
          <td>pageTitle</td>
          <td>string</td>
          <td><b>Optional</b>. Specifies the name of the page, at the moment where the hit has been sent.</td>
        </tr>
    </tbody>
</table>

## `Event Hit`

<table class="table table-bordered table-striped">
    <thead>
    <tr>
        <th style="width: 100px;">Attribute</th>
        <th style="width: 50px;">Type</th>
        <th>Description</th>
    </tr>
    </thead>
    <tbody>
        <tr>
          <td>category</td>
          <td>string</td>
          <td><b>Required</b>. Specifies the category of your event.<br><b>NOTE</b>: The value must be either <b>Action Tracking</b> or <b>User Engagement</b>.</td>
        </tr>
        <tr>
          <td>action</td>
          <td>string</td>
          <td><b>Required</b>. The name of the KPI you will have inside the reporting.</td>
        </tr>
        <tr>
          <td>label</td>
          <td>string</td>
          <td><b>Optional</b>. Specifies additional description of your event.</td>
        </tr>
        <tr>
          <td>value</td>
          <td>number</td>
          <td><b>Optional</b>. Specifies how much you won with that event.<br>For example, depending on the lead generated, you will earn 10 to 100 euros. Adding that value will enable us to do a sum inside the reporting and give you the average value too.<br><b>NOTE</b>: Value must be non-negative.</td>
        </tr>
        <tr>
          <td>documentLocation</td>
          <td>string</td>
          <td><b>Optional</b>. Specifies the current URL of the page, at the moment where the hit has been sent.</td>
        </tr>
        <tr>
          <td>pageTitle</td>
          <td>string</td>
          <td><b>Optional</b>. Specifies the name of the page, at the moment where the hit has been sent.</td>
        </tr>
    </tbody>
</table>

# Contributing

Take a look to the [Contributors Guide](CONTRIBUTING.md).

# What is Flagship ?

Have a look [here](https://www.abtasty.com/solutions-product-teams/).

# License

Flagship uses license under the [Apache version 2.0](http://www.apache.org/licenses/).
