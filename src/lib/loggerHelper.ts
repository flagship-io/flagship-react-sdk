import FlagshipLogger, { LogConfig, FsLogger } from '@flagship.io/js-sdk-logs';

const FsLogger = {
    getLogger: (config: LogConfig = { enableConsoleLogs: false, nodeEnv: 'unknown' }): FsLogger => {
        return FlagshipLogger.getLogger(config, 'Flagship React SDK');
    }
};

export default FsLogger;
