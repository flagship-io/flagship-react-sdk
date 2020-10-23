import React, { useContext } from 'react';
import { Button, Form } from 'react-bootstrap';

import { AppSettings, SdkSettings, SettingContext } from '../../../../../../../App';
import config from '../../../../../../../config';
import CodeBlock from '../../../../../../common/CodeBlock';

import { NotificationManager } from 'react-notifications';
import { saveLocalStorage } from '../../../../../../../helper/utils';

const PlayConfig: React.FC = () => {
    const { currentSettings: currSettings, setSettings /* , QA */ } = useContext(SettingContext) as AppSettings;
    const [newSettings, setNewSettings] = React.useState<SdkSettings>({
        ...currSettings
    });

    const handleSettings = (e, key) => {
        const computeValue = () => {
            if (key === 'pollingInterval') {
                return parseInt(e.target.value.split(' min')[0]);
            } else if (key === 'timeout') {
                return parseFloat(e.target.value.split(' second(s)')[0]);
            }
            return e.target.value;
        };
        setNewSettings({
            ...newSettings,
            [key]: computeValue()
        });
    };
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
                    <Form.Control
                        type="text"
                        className="fsTextField"
                        onChange={(e) => handleSettings(e, 'envId')}
                        value={newSettings.envId}
                        placeholder={newSettings.apiKey || 'this field is required !'}
                    ></Form.Control>
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
                    <Form.Control as="select" onChange={(e) => handleSettings(e, 'nodeEnv')}>
                        <option key={newSettings.nodeEnv}>{newSettings.nodeEnv}</option>
                        {config.sandbox.nodeEnv
                            .filter((i) => i !== newSettings.nodeEnv)
                            .map((id) => (
                                <option key={id}>{id}</option>
                            ))}
                    </Form.Control>
                </Form.Group>
                <Form.Group
                    controlId="initForm.Control1.22"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginLeft: '16px'
                    }}
                >
                    <div>flagshipApi: </div>
                    <Form.Control as="select" onChange={(e) => handleSettings(e, 'flagshipApi')}>
                        <option key={newSettings.flagshipApi}>{newSettings.flagshipApi}</option>
                        {config.sandbox.flagshipApi
                            .filter((i) => i !== newSettings.flagshipApi)
                            .map((id) => (
                                <option key={id}>{id}</option>
                            ))}
                    </Form.Control>
                </Form.Group>
                <Form.Group
                    controlId="initForm.Control1.23"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginLeft: '16px'
                    }}
                >
                    <div>apiKey: </div>
                    <Form.Control
                        type="text"
                        className="fsTextField"
                        onChange={(e) => handleSettings(e, 'apiKey')}
                        placeholder={newSettings.apiKey || 'null'}
                    ></Form.Control>
                </Form.Group>
                <Form.Group
                    controlId="initForm.Control1.21"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginLeft: '16px'
                    }}
                >
                    <div>decisionMode: </div>
                    <Form.Control as="select" onChange={(e) => handleSettings(e, 'decisionMode')}>
                        <option key={newSettings.decisionMode}>{newSettings.decisionMode}</option>
                        {config.sandbox.decisionMode
                            .filter((i) => i !== newSettings.decisionMode)
                            .map((id) => (
                                <option key={id}>{id}</option>
                            ))}
                    </Form.Control>
                </Form.Group>
                {newSettings.decisionMode === 'Bucketing' && (
                    <Form.Group
                        controlId="initForm.Control1.21"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginLeft: '16px'
                        }}
                    >
                        <div>pollingInterval: </div>
                        <Form.Control as="select" onChange={(e) => handleSettings(e, 'pollingInterval')}>
                            <option key={'pollingInterval' + newSettings.pollingInterval?.toString()}>
                                {newSettings.pollingInterval} secondes
                            </option>
                            {config.sandbox.pollingInterval
                                .filter((i) => i !== newSettings.pollingInterval)
                                .map((id) => (
                                    <option key={id}>{id} secondes</option>
                                ))}
                        </Form.Control>
                    </Form.Group>
                )}
                <Form.Group
                    controlId="initForm.Control1.23"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginLeft: '16px'
                    }}
                >
                    <div>timeout: </div>
                    <Form.Control as="select" onChange={(e) => handleSettings(e, 'timeout')}>
                        <option key={newSettings.timeout}>{newSettings.timeout} second(s)</option>
                        {config.sandbox.timeout
                            .filter((i) => i !== newSettings.timeout)
                            .map((id) => (
                                <option key={id}>{id} second(s)</option>
                            ))}
                    </Form.Control>
                </Form.Group>
                {Object.keys({
                    ...config.sandbox.config
                })
                    // .filter((i) => i != 'nodeEnv')
                    .map((setting) => (
                        <Form.Group controlId={setting + 'Form'} key={setting}>
                            <Form.Check
                                type="checkbox"
                                checked={!!newSettings[setting] || false}
                                onChange={(e) => {
                                    const toSubmit = {
                                        ...newSettings,
                                        [setting]: e.currentTarget.checked
                                    };
                                    if (typeof newSettings[setting] !== 'boolean') {
                                        delete toSubmit[setting];
                                    }
                                    setNewSettings(toSubmit);
                                }}
                                label={`${setting}=${newSettings[setting]}`}
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
                    onClick={() => {
                        setSettings({ ...newSettings, apiKey: newSettings.apiKey || null });
                        NotificationManager.info('Settings updated');
                    }}
                >
                    Apply change
                </Button>
                <Button
                    className="PrimaryBtn ml3"
                    onClick={() => {
                        if (saveLocalStorage(() => ({ ...newSettings, apiKey: newSettings.apiKey || null })).success) {
                            NotificationManager.info('Settings saved in local storage');
                        } else {
                            NotificationManager.error('Unable to save settings in local storage');
                        }
                    }}
                >
                    Save in local storage
                </Button>
            </div>
            <div>Since we have set those settings:</div>
            <CodeBlock className="mv3" codeString={`${JSON.stringify(currSettings, null, 2)}`} />
            <div>When you change those values, you can notice the behavior of the SDK, on logs & network.</div>
            <div className="mb5">It will impact the output of Flagship SDK Hooks as well, take a look below.</div>
        </>
    );
};

export default PlayConfig;
