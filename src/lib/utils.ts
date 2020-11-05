export const areWeTestingWithJest = (): boolean => {
    return process.env.JEST_WORKER_ID !== undefined;
};
