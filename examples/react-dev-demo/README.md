<p align="center">

<img  src="https://mk0abtastybwtpirqi5t.kinstacdn.com/wp-content/uploads/picture-solutions-persona-product-flagship.jpg"  width="211"  height="182"  alt="flagship-js-sdk"  />

</p>

# Sample of React app illustrating technical aspect of [Flagship - React SDK](../../README.md)

## Online demo

<ul style="line-height:1.4;"><li><a href='https://abtasty.github.io/flagship-react-sdk/'>👉click here ! 😎</a></li></ul>
  
## Try it locally

### Prerequisites

-   **Node.js**: version 6.0.0 or later.

-   **Npm**: version 5.2.0 or later.

## Getting Started

-   **Install** the node module:

```
examples/react-dev-demo$ npm install
```

-   **Start** the project:

```
examples/react-dev-demo$ npm start
```

## Run with local Flagship JS SDK

Two possible ways exist.

### 1st option:

-   You need to create a local package of `@flagship.io/react-sdk`:

    -   1 - At the root level (=`PATH/TO/flagship-react-sdk`), run:

        ```
        npm i && npm run build && npm pack
        ```

    -   2 - You supposed to have a `.tgz` file freshly created, with following name `flagship.io-react-sdk-x.x.x.tgz` where `x.x.x` corresponding to last version of the Flagship React SDK.

    -   3 - Move this `.tgz` file to the example that you want to run locally, in our case `react-dev-demo`:
        ```
        mv ./flagship.io-react-sdk-x.x.x.tgz ./examples/react-dev-demo
        ```
    -   4 - [Skip this step if first time following **1st option** steps] As npm keeps some cache of node modules, we must rename the `.tgz` file so npm will consider our package as a new one:

        ```
        mv ./flagship.io-react-sdk-x.x.x.tgz ./flagship.io-react-sdk-x.x.x_UNIQUE_VALUE.tgz
        ```

        and also delete previous version:

        ```
        rm -r ./node_modules/@flagship.io && rm ./package-lock.json
        ```

    -   6 - Edit the `package.json` to consider the `.tgz` for Flagship React SDK, it should look like this:

        ```
        "@flagship.io/js-sdk": "flagship.io-react-sdk-x.x.x_UNIQUE_VALUE.tgz",
        ```

    -   7 - Install the modules:
        ```
        npm i
        ```
    -   8 - Start the project, it's ready:
        ```
        npm run start
        ```

### 2nd option:

-   You need to link `@flagship.io/react-sdk` :

    -   1 - At the root level (=`PATH/TO/flagship-react-sdk`), run:

        ```
        flagship-react-sdk$ npm link
        ```

    -   2 - Then, move to `examples/react-dev-demo`:

        ```
        examples/react-dev-demo$ npm link PATH/TO/flagship-react-sdk
        ```

    -   3 - Start the project like this:
        ```
        rm -fr ./node_modules/react && npm start
        ```

## QA

1. Unzip the file `.zip` file

2. Open a terminal, and go to the path where you unzipped. (We'll assume, you unzipped in `Downloads` folder)

3. Now follow this path by running :

    ```
    cd NAME_OF_THE_UNZIPPED_FOLDER/examples/react-dev-demo
    ```

4. Run :

    ```
    npm install
    ```

5. Run :

    ```
    npm start
    ```

6. The QA app is now running locally on your computer, you're ready !

## More about Flagship REACT SDK ?

[👉Click here 😎](../../README.md)

## What is Flagship ? ⛵️

[👉Click here 😄](https://www.abtasty.com/solutions-product-teams/)
