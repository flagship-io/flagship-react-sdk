import React from 'react';

import CodeBlock from '../../../../../../common/CodeBlock';

const PlayWithStartAndStopBucketing: React.FC = () => {
    return (
        <>
            <div className="mv3">
                This function allow to start the bucketing polling (when "fetchNow" is set to "false") and stop the
                bucketing when desired.
            </div>

            <CodeBlock
                className="mv3"
                codeString={`const { startBucketingPolling, stopBucketingPolling } = useFlagship();
return (
    <Button
        onClick={() => startBucketingPolling()}
    >
        Start the bucketing
    </Button>
    <Button
        onClick={() => stopBucketingPolling()}
    >
        Stop the bucketing
    </Button>
);`}
            />
        </>
    );
};

export default PlayWithStartAndStopBucketing;
