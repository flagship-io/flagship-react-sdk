const React = require('react');
const DynamicForm = require('./components/dynamicForm');
const FlagshipProvider = require('@flagship.io/react-sdk').FlagshipProvider;

const DefaultLayout = require('./layouts/default');
const initialModifications = require('./mock').initialModifications;
const fsEnvId = 'bn1ab7m56qolupi5sa0g';
const fsApiKey = 'M2FYdfXsJ12tjJQuadw7y9DZojqNGBvecpjGXY93';
const visitorId = 'visitor1';
const visitorContext = {
    isAwesome: false,
    isEvil: false
};

class HelloMessage extends React.Component {
    constructor(...args) {
        super(...args);

        this.state = { validated: false };
    }

    render() {
        return (
            <DefaultLayout title={this.props.title}>
                <FlagshipProvider
                    fetchNow
                    envId={fsEnvId}
                    apiKey={fsApiKey}
                    nodeEnv="development" // <= Display debug logs
                    visitorData={{
                        id: visitorId,
                        context: visitorContext
                    }}
                    initialModifications={initialModifications}
                    enableConsoleLogs={true}
                    decisionMode="Bucketing"
                    pollingInterval={10}
                >
                    <DynamicForm />
                </FlagshipProvider>
            </DefaultLayout>
        );
    }
}

module.exports = HelloMessage;
