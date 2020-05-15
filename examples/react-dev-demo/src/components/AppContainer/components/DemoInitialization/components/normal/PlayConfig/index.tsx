import React, { useContext } from 'react';
import { Formik } from 'formik';
import { Form, Button, Col } from 'react-bootstrap';
import config from '../../../../../../../config';
import {
    SettingContext,
    SdkSettings,
    AppSettings
} from '../../../../../../../App';
import CodeBlock from '../../../../../../common/CodeBlock';
const PlayConfig: React.FC = () => {
    const { currentSettings: currSettings, setSettings, QA } = useContext(
        SettingContext
    ) as AppSettings;
    const [newSettings, setNewSettings] = React.useState<SdkSettings>({
        ...currSettings
    });

    const handleEnvId = (e) =>
        setNewSettings({ ...newSettings, envId: e.target.value });

    const handleNodeEnv = (e) =>
        setNewSettings({
            ...newSettings,
            sdkConfig: {
                ...newSettings.sdkConfig,
                nodeEnv: e.target.value
            }
        });
    return (
        <>
            <Form>
                <Form.Group
                    controlId="initForm.Control1.1"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginLeft: '16px'
                    }}
                >
                    <div>envId: </div>
                    <Form.Control as="select" onChange={handleEnvId}>
                        <option key={newSettings.envId}>
                            {newSettings.envId}
                        </option>
                        {config.sandbox.envId
                            .filter((i) => i != newSettings.envId)
                            .map((id) => (
                                <option key={id}>{id}</option>
                            ))}
                    </Form.Control>
                </Form.Group>
                <Form.Group
                    controlId="initForm.Control1.11"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginLeft: '16px'
                    }}
                >
                    <div>nodeEnv: </div>
                    <Form.Control as="select" onChange={handleNodeEnv}>
                        <option key={newSettings.sdkConfig.nodeEnv}>
                            {newSettings.sdkConfig.nodeEnv}
                        </option>
                        {config.sandbox.nodeEnv
                            .filter((i) => i != newSettings.sdkConfig.nodeEnv)
                            .map((id) => (
                                <option key={id}>{id}</option>
                            ))}
                    </Form.Control>
                </Form.Group>
                {Object.keys({
                    ...config.sandbox.config,
                    ...newSettings.sdkConfig
                })
                    .filter((i) => i != 'nodeEnv')
                    .map((setting) => (
                        <Form.Group controlId={setting + 'Form'}>
                            <Form.Check
                                type="checkbox"
                                checked={
                                    !!newSettings.sdkConfig[setting] || false
                                }
                                onChange={(e) => {
                                    const toSubmit = {
                                        ...newSettings,
                                        sdkConfig: {
                                            ...newSettings.sdkConfig,
                                            [setting]: e.currentTarget.checked
                                        }
                                    };
                                    if (
                                        typeof newSettings.sdkConfig[setting] !=
                                        'boolean'
                                    ) {
                                        delete toSubmit.sdkConfig[setting];
                                    }
                                    setNewSettings(toSubmit);
                                }}
                                label={`${setting}=${newSettings.sdkConfig[setting]}`}
                            />
                        </Form.Group>
                    ))}
            </Form>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'flex-end'
                }}
            >
                <Button
                    variant="secondary"
                    onClick={() => setSettings({ ...newSettings })}
                >
                    Apply change
                </Button>
            </div>
            <div>Since we have set those settings:</div>
            <CodeBlock
                className="mv3"
                codeString={`${JSON.stringify(
                    currSettings.sdkConfig,
                    null,
                    2
                )}`}
            />
            <div>
                When you change those values, you can notice the behavior of the
                SDK, on logs & network.
            </div>
            <div className="mb5">
                It will impact the output of Flagship SDK Hooks as well, take a
                look below.
            </div>
        </>
    );
};

export default PlayConfig;
