import { FlagshipReactSdkConfig } from '../../../../dist';

const sdkSettings: FlagshipReactSdkConfig = {
    fetchNow: true,
    enableConsoleLogs: true,
    enableErrorLayout: true,
    nodeEnv: 'production'
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
        nodeEnv: ['production', 'development'],
        visitorId: ['test-vid', 'test-vid_2', 'test-vid_3']
    }
};
export default config;
