import React from 'react';
import CodeBlock from '../../../../../../common/CodeBlock';
import { useFsModifications } from '@flagship.io/react-sdk';
import { Button } from 'react-bootstrap';

const PlayWithParams: React.FC = () => {
    const fsModifications = useFsModifications([
        {
            key: 'color',
            defaultValue: '#FF33E3', // pink
            activate: false
        }
    ]);
    const demoHookName = 'useFsModifications';
    return (
        <>
            <p>
                Use <b>{demoHookName}</b> hook to get the modifications:
            </p>
            <CodeBlock
                className="mv3"
                codeString={`import { useFsModifications } from '@flagship.io/react-sdk';
const fsModifications = useFsModifications([
    {
        key: 'color',
        defaultValue: '#FF33E3', // pink
        activate: false
    }
]);`}
            />
            <p>Output: </p>
            <div>
                <Button
                    variant="secondary"
                    style={{
                        backgroundColor: fsModifications.color as string
                    }}
                >
                    {`My color tells my visitor mood (backgroundColor=${fsModifications.color})`}
                </Button>
            </div>
            <div className="mv3">
                Based on the campaign that we set on Flagship platform, the color of the button will change depending
                values set in the <a href="#playWithVisitorContext">visitor context</a>.
            </div>
            <CodeBlock
                className="mv3"
                codeString={`<Button
    variant="secondary"
    style={{
        backgroundColor: fsModifications.color
    }}
>
    {\`My color tells my visitor mood (backgroundColor=\${fsModifications.color})\`}
</Button>`}
            />
        </>
    );
};

export default PlayWithParams;
