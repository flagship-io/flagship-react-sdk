import React from 'react';
import { useFlagship } from '@flagship.io/react-sdk';
import CodeBlock from '../../../../../../common/CodeBlock';
import { Button } from 'react-bootstrap';

const PlayWithModifications: React.FC = () => {
    const fsParams = {
        modifications: {
            requested: [
                {
                    key: 'btnColor',
                    defaultValue: 'green',
                    activate: false
                }
            ]
        }
    };
    const output = useFlagship(fsParams);
    const { modifications: fsModifications } = output;
    return (
        <>
            <p>demo: </p>
            <div>
                <Button
                    variant="secondary"
                    style={{
                        backgroundColor: fsModifications.btnColor
                    }}
                >
                    {`I'm a button customized with Flagship (backgroundColor=${fsModifications.btnColor})`}
                </Button>
            </div>
            <CodeBlock
                className="mv3"
                codeString={`<Button
    variant="secondary"
    style={{
        backgroundColor: fsModifications.btnColor
    }}
>
    {\`I'm a button customized with Flagship (backgroundColor=\${fsModifications.btnColor})\`}
</Button>`}
            />
        </>
    );
};

export default PlayWithModifications;
