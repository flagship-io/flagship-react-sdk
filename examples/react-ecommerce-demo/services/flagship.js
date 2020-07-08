import flagship from '@flagship.io/js-sdk';

let fsClients = {};

const init = (envId) => {
    fsClients[envId] = flagship.start(envId, {});
};

const getClient = (envId) => {
    if (!fsClients[envId]) {
        init(envId);
    }
    return fsClients[envId];
};

export { init, getClient };
