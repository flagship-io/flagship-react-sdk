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

## Contributing

Take a look to the [Contributors Guide](CONTRIBUTING.md).

## What is Flagship ?

Have a look [here](https://www.abtasty.com/solutions-product-teams/).

## License

Flagship uses license under the [Apache version 2.0](http://www.apache.org/licenses/).
