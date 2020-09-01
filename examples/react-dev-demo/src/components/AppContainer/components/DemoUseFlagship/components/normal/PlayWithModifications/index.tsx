import React from 'react';
import { useFlagship } from '@flagship.io/react-sdk';
import CodeBlock from '../../../../../../common/CodeBlock';
import { Button } from 'react-bootstrap';

const PlayWithModifications: React.FC = () => {
    const fsParams = {
        modifications: {
            requested: [
                {
                    key: 'color',
                    defaultValue: '#FF33E3',
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
                        backgroundColor: fsModifications.color as string
                    }}
                >
                    {`I'm a button customized with Flagship (backgroundColor=${fsModifications.color})`}
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
    {\`I'm a button customized with Flagship (backgroundColor=\${fsModifications.color})\`}
</Button>`}
            />
        </>
    );
};

export default PlayWithModifications;
