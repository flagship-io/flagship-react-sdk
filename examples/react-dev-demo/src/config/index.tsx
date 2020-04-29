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
        context: { isAuth: true, isVip: false }
    },
    sandbox: {
        config: {
            fetchNow: true,
            enableConsoleLogs: true,
            enableErrorLayout: true
        },
        envId: ['bn1ab7m56qolupi5sa0g_1', 'bn1ab7m56qolupi5sa0g_2'],
        nodeEnv: ['production', 'development'],
        visitorId: ['test-vid', 'test-vid_2', 'test-vid_3']
    }
};
export default config;
