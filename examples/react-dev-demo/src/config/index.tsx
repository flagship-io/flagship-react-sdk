import { FlagshipReactSdkConfig } from '../../../../dist';

const sdkSettings: FlagshipReactSdkConfig = {
    fetchNow: true,
    enableConsoleLogs: true,
    enableErrorLayout: true,
    nodeEnv: 'development'
};

const config = {
    envId: 'bn1ab7m56qolupi5sa0g',
    sdkConfig: sdkSettings,
    visitorData: {
        id: 'test-vid',
        context: { isAuth: true, numberTransaction: 12, isVip: false }
    },
    sandbox: {
        envId: [
            'bn1ab7m56qolupi5sa0g',
            'bn1ab7m56qolupi5sa0g_1',
            'bn1ab7m56qolupi5sa0g_2'
        ],
        nodeEnv: ['development', 'production'],
        visitorId: ['test-vid', 'test-vid_2', 'test-vid_3']
    }
};
export default config;
