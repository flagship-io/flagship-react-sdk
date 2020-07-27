const config = {
    envId: 'bn1ab7m56qolupi5sa0g',
    fetchNow: true,
    decisionMode: 'API',
    pollingInterval: 5,
    enableConsoleLogs: true,
    enableErrorLayout: true,
    nodeEnv: 'production',
    enableSafeMode: true,
    visitorData: {
        id: 'test-vid',
        context: { isAwesome: false, isEvil: false }
    },
    sandbox: {
        config: {
            fetchNow: true,
            enableConsoleLogs: true,
            enableErrorLayout: true
        },
        envId: ['bn1ab7m56qolupi5sa0g_fake_1', 'bn1ab7m56qolupi5sa0g_fake_2'],
        nodeEnv: ['production', 'development'],
        pollingInterval: [1, 2, 5, 10],
        decisionMode: ['API', 'Bucketing'],
        visitorId: ['test-vid', 'test-vid_2', 'test-vid_3']
    }
};
export default config;
