const config = {
    envId: 'bn1ab7m56qolupi5sa0g',
    fetchNow: true,
    decisionMode: 'API',
    pollingInterval: 60,
    timeout: 2,
    enableConsoleLogs: true,
    enableErrorLayout: true,
    enableSafeMode: true,
    nodeEnv: 'production',
    flagshipApi: 'https://decision.flagship.io/v2/',
    apiKey: 'M2FYdfXsJ12tjJQuadw7y9DZojqNGBvecpjGXY93',
    visitorData: {
        id: 'test-vid',
        context: { isAwesome: false, isEvil: false },
        isAuthenticated: false
    },
    sandbox: {
        config: {
            fetchNow: true,
            enableSafeMode: true,
            enableConsoleLogs: true,
            enableErrorLayout: true
        },
        envId: ['bn1ab7m56qolupi5sa0g_fake_1', 'bn1ab7m56qolupi5sa0g_fake_2'],
        nodeEnv: ['production', 'development'],
        pollingInterval: [10, 60, 120, 300],
        decisionMode: ['API', 'Bucketing'],
        timeout: [0.01, 0.5, 1, 2],
        flagshipApi: [
            'https://decision.flagship.io/v2/',
            'https://decision-api.flagship.io/v1/',
            'https://decision-staging.flagship.io/v2/'
        ],
        visitorId: ['test-vid', 'test-vid_2', 'test-vid_3']
    }
};
export default config;
