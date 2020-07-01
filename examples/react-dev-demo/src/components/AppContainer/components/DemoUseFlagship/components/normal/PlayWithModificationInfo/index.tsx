import React from 'react';

import CodeBlock from '../../../../../../common/CodeBlock';

const PlayWithModificationInfo: React.FC = () => {
    return (
        <>
            <div className="mv3">This function provides all the data needed to send it to a third party tool.</div>
            <CodeBlock
                className="mv3"
                codeString={`const { getModificationInfo } = useFlagship();
return (
    <Button
        onClick={getModificationInfo('color')
            .then((response) => {
                // when succeed
            })
            .catch((error) => {
                // when fail
            })}
    >
        Apply change
    </Button>
);`}
            />
        </>
    );
};

export default PlayWithModificationInfo;
