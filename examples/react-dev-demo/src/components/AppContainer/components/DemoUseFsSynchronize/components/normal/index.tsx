import React from 'react';
import CodeBlock from '../../../../../common/CodeBlock';
import { Form, Button } from 'react-bootstrap';
import { useFlagship } from '@flagship.io/react-sdk';
import { NotificationManager } from 'react-notifications';

const PlayWithSynchronize: React.FC = () => {
    const [activateAllModifications, setActivate] = React.useState(false);
    const { synchronizeModifications } = useFlagship();
    return (
        <>
            <div className="mb3">
                <b>Demo</b>:
            </div>
            <CodeBlock
                className="mv3"
                codeString={`const { synchronizeModifications } = useFlagship();

return (
    <>
        <Button
            onClick={() => {
                synchronizeModifications(activateAllModifications)
                    .then((statusCode) => {
                        if (statusCode < 300) {
                            // Notify success...
                        } else {
                            // Notify failure...
                        }
                    })
                    .catch((error) => {
                        // Notify error...
                    });
            }}
        >
            Trigger a synchronize
        </Button>
    </>
)`}
            ></CodeBlock>
            <div className="mb3">
                <code>synchronizeModifications</code> is accessible by extracting it from <code>useFlagship</code> hook.
            </div>
            <div className="mb3">
                Calling <code>synchronizeModifications</code> will return a <code>{'Promise<number>'}</code> in case of
                you need to ensure that synchronization succeed.
            </div>
            <div className="mb3">
                The function takes an optional <code>boolean</code> argument if you want to activate all campaigns that
                will be synchronized.
            </div>
            <Form>
                <Form.Group controlId="demoFsSynchronize.ControlSelect2">
                    <Form.Label>Playing with argument(s)</Form.Label>
                    <Form.Check
                        type="checkbox"
                        checked={activateAllModifications}
                        onChange={(e) => setActivate(e.currentTarget.checked)}
                        label={`activateAllModifications=${activateAllModifications}`}
                    />
                </Form.Group>
            </Form>
            <div className="flex flex-row-reverse">
                <Button
                    variant="secondary"
                    onClick={() => {
                        synchronizeModifications(activateAllModifications)
                            .then((statusCode) => {
                                if (statusCode < 300) {
                                    NotificationManager.info(
                                        'synchronizeModifications success with statusCode=' + statusCode
                                    );
                                } else {
                                    NotificationManager.error(
                                        'synchronizeModifications failed with statusCode=' + statusCode
                                    );
                                }
                            })
                            .catch((error) => {
                                NotificationManager.error('synchronizeModifications failed with error=' + error.stack);
                            });
                    }}
                >
                    Trigger a synchronize
                </Button>
            </div>
        </>
    );
};

export default PlayWithSynchronize;
