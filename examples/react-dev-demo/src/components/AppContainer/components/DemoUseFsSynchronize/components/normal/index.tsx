import React from 'react';
import CodeBlock from '../../../../../common/CodeBlock';
import { Form } from 'react-bootstrap';
import { useFsSynchronize } from '@flagship.io/react-sdk';

const PlayWithSynchronize: React.FC = () => {
    const demoHookName = 'useFsSynchronize';
    const [listenedValue, setValue] = React.useState(false);
    const [activateAllModifications, setActivate] = React.useState(false);
    useFsSynchronize([listenedValue], activateAllModifications);
    return (
        <>
            <CodeBlock
                className="mv3"
                codeString={`useFsSynchronize([listenedValue], activateAllModifications);`}
            ></CodeBlock>
            <div>
                When <b>listenedValue</b> value changed, it will update
                modifications in cache (=synchronization).
            </div>
            <div className="mb3">
                You can also notice that enabling{' '}
                <b>activateAllModifications</b> to true will modify the payload
                sent to the Flagship API and thus trigger an activate.
            </div>
            <Form>
                <Form.Group controlId="demoFsSynchronize.ControlSelect1">
                    <Form.Label>Playing with 1st argument</Form.Label>
                    <Form.Check
                        type="checkbox"
                        checked={listenedValue}
                        onChange={(e) => setValue(e.currentTarget.checked)}
                        label={`listenedValue=${listenedValue}`}
                    />
                </Form.Group>
                <Form.Group controlId="demoFsSynchronize.ControlSelect2">
                    <Form.Label>Playing with 2nd argument</Form.Label>
                    <Form.Check
                        type="checkbox"
                        checked={activateAllModifications}
                        onChange={(e) => setActivate(e.currentTarget.checked)}
                        label={`activateAllModifications=${activateAllModifications}`}
                    />
                </Form.Group>
            </Form>
        </>
    );
};

export default PlayWithSynchronize;
