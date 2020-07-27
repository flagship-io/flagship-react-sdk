# Contributing to Flagship - REACT SDK

When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.

## Pull Request Process

0. [Optional] If you have change the flagship-js-sdk locally as well, make sure the dependency with flagship-react-sdk is updated.

    ```
    flagship-js-sdk$ npm run build && npm pack
    ```

    ```
    flagship-js-sdk$ mv ./flagship.io-js-sdk-X.X.X.tgz ./PATH/TO/flagship-react-sdk
    ```

    In the `flagship-react-sdk/package.json`, update the dependency:

    ```
    "dependencies": {
        "@flagship.io/js-sdk": "file:flagship.io-js-sdk-X.X.X.tgz",
        "@flagship.io/js-sdk-logs": "^0.1.1"
    },
    ```

    ```
    flagship-react-sdk$ rm -r ./node_modules/@flagship.io && npm i
    ```

    **NOTE**: If you repeat step 0 more than once, make sure the `flagship.io-js-sdk-X.X.X.tgz` does not have same name.

1. Ensure you're able to do a build.

    ```
    flagship-react-sdk$ npm run build
    ```

    If there is a dependency with a local flagship-js-sdk package (= step 0), do instead:

    ```
    flagship-react-sdk$ npm run build:skipUpdate
    ```

2. Ensure you're able to pass unit test.

    ```
    flagship-react-sdk$ npm run test
    ```

3) Consider updating the [README.md](./README.md) with details of changes if needed.

4) Add yourself as a contributor. To add yourself to the table of contributors, follow this command:

    ```
    # Add new contributor <username>, who made a contribution of type <contribution>
    npm run contributors:add -- <username> <contribution>

    # Example:
    npm run contributors:add -- jfmengels code,doc
    ```

    See the [Emoji Key (Contribution Types Reference)](https://allcontributors.org/docs/en/emoji-key) for a list of valid contribution types.

5. You may merge the Pull Request in once you have the sign-off of two other developers, or if you
   do not have permission to do that, you may request the second reviewer to merge it for you.
