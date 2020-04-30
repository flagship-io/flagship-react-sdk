import React from 'react';
import CodeBlock from '../../../../../../common/CodeBlock';
import { useFsModifications } from '@flagship.io/react-sdk';
import { Button } from 'react-bootstrap';

const PlayWithParams: React.FC = () => {
    const fsModifications = useFsModifications([
        {
            key: 'btnColor',
            defaultValue: 'green',
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
      key: 'btnColor',
      defaultValue: 'green',
      activate: false
  }
]);              `}
            />
            <p>Output: </p>
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

export default PlayWithParams;
