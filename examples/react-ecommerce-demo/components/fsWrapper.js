import { FlagshipProvider } from '@flagship.io/react-sdk';
import Cookies from 'js-cookie';
import { useState } from 'react';

let timer;
let oldCookie;

export default ({ children }) => {
    const [fsInfos, setFsInfos] = useState({});

    const updateFsInfos = (fsInfos) => {
        let fsCookie = Cookies.get('fscookie');
        if (fsCookie && fsCookie != oldCookie) {
            oldCookie = fsCookie;
            try {
                const fsCookieParse = JSON.parse(
                    Buffer.from(fsCookie, 'base64').toString('utf8')
                );
                const newFsInfos = {
                    envId: fsCookieParse.environment_id,
                    visitor: {
                        id: fsCookieParse.visitor_id,
                        context: fsCookieParse.context
                    }
                };
                if (JSON.stringify(fsInfos) != JSON.stringify(newFsInfos)) {
                    setFsInfos(newFsInfos);
                }
            } catch (e) {
                console.log('error on parsing fscookie : ', e.message);
            }
        }
    };

    if (!timer) {
        timer = window.setInterval(updateFsInfos, 1000);
    }

    if (!fsInfos.envId) {
        updateFsInfos();
    }

    console.log('fsInfos : ', fsInfos);
    if (fsInfos && fsInfos.envId) {
        return (
            <FlagshipProvider
                envId={fsInfos.envId}
                visitorData={fsInfos.visitor}
                fetchNow={true}
                enableConsoleLogs={true}
            >
                {children}
            </FlagshipProvider>
        );
    }

    return <div>{children}</div>;
};
