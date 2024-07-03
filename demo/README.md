# Flagship Demo React Application

Welcome to the Flagship Demo React Application. This application is a demonstration of how to use Flagship for feature flagging and A/B testing in a ReactJs application.

This implementation is based on two use cases:

1. **Fs demo toggle use case**: This feature toggle campaign enables a discount for VIP users.
2. **Fs demo A/B Test use case**: This A/B test campaign allows you to test the color of the 'Add to Cart' button.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed the latest version of [Node.js](https://nodejs.org/en/download/)
- You have installed [Yarn](https://yarnpkg.com/getting-started/install)
- You have [Docker](https://www.docker.com/products/docker-desktop) installed (optional)
- [Flagship account](https://www.abtasty.com)

## Getting Started

### Running the Application Locally

Follow these steps to get up and running quickly on your local machine:

1. Install the dependencies:

    ```bash
    yarn install
    ```

2. Start the application:

    ```bash
    yarn start
    ```

The application will be accessible at `http://localhost:3000`.

### Running the Application in Docker

If you prefer to use Docker, you can build and run the application using the provided shell script:

```bash
chmod +x run-docker.sh && ./run-docker.sh
```

### Running the Application in a Sandbox

You can also run this application in a sandbox environment. Click [here](https://githubbox.com/flagship-io/flagship-react-sdk/tree/demo-example/demo) to open the sandbox.
