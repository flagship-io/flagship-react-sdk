import React from 'react';
import { Button } from 'react-bootstrap';
import CodeBlock from '../../../../../common/CodeBlock';
import { useFsActivate } from '@flagship.io/react-sdk';

const PlayWithActivate: React.FC = () => {
    const [toggle, setToggle] = React.useState(false);
    useFsActivate(['btnColor', 'otherKey1', 'otherKey2'], [toggle]);
    const demoHookName = 'useFsActivate';
    return (
        <>
            <p>
                Use <b>{demoHookName}</b> hook to trigger activation of a
                modification when needed:
            </p>
            <CodeBlock
                className="mv3"
                codeString={`const [toggle, setToggle] = React.useState(false);
useFsActivate(['btnColor', 'otherKey1', 'otherKey2'], [toggle]);

// {...}

<Button
variant="secondary"
onClick={() => setToggle(!toggle)}
>
    Trigger activate
</Button>`}
            />
            <Button variant="secondary" onClick={() => setToggle(!toggle)}>
                Trigger activate
            </Button>
            <div className="mv3">
                <p>
                    In this example, we're activating only when <i>toggle</i>{' '}
                    value has changed as we have specified a 2nd argument in{' '}
                    <i>useFsActivate</i> hook.
                </p>
                <p>
                    We also specified in 1st argument that we want to activate 3
                    keys. For each key, there is 2 possible scenarios:
                </p>
                <p>If the key exist, a http request "activate" will be done.</p>
                <p>
                    If the key does not exist, you will receive a warning log.
                </p>
            </div>
        </>
    );
};

export default PlayWithActivate;
