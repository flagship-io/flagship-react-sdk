/* eslint-disable no-console */

import { FlagshipSdkConfig } from '@flagship.io/js-sdk';

export type FsLogger = {
    warn(str: string): void | null;
    error(str: string): void | null;
    info(str: string): void | null;
    fatal(str: string): void | null;
    debug(str: string): void | null;
};

/*
Available logs:
    - debug()
    - info()
    - warn()
    - error()
    - fatal()
*/

const loggerHelper = {
    getLogger: (
        config = { enableConsoleLogs: false, nodeEnv: 'unknown' },
        name = 'Flagship React SDK'
    ): FsLogger => {
        const { enableConsoleLogs } = config;
        const timestamp = `[${new Date().toISOString().slice(11, -5)}] - `;
        return {
            warn: (str: string): void | null =>
                enableConsoleLogs
                    ? console.warn(`${timestamp}${name} - ${str}`)
                    : null,
            error: (str: string): void | null =>
                enableConsoleLogs
                    ? console.error(`${timestamp}${name} - ${str}`)
                    : null,
            info: (str: string): void | null =>
                enableConsoleLogs
                    ? console.log(`${timestamp}${name} - ${str}`)
                    : null,
            fatal: (str: string): void | null =>
                enableConsoleLogs
                    ? console.error(`${timestamp}${name} - Fatal: ${str}`)
                    : null,
            debug: (str: string): void | null =>
                config.nodeEnv !== 'production' && enableConsoleLogs
                    ? console.log(`${timestamp}${name} - Debug: ${str}`)
                    : null
        };
    }
};

export default loggerHelper;
