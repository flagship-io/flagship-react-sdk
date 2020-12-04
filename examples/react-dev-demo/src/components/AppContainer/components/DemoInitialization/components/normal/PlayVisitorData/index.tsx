import React, { useContext } from 'react';
import { Button, Form } from 'react-bootstrap';
import { NotificationManager } from 'react-notifications';

import { AppSettings, SdkSettings, SettingContext } from '../../../../../../../App';
import config from '../../../../../../../config';

const PlayVisitorData: React.FC = () => {
    const { currentSettings: currSettings, setSettings } = useContext(SettingContext) as AppSettings;

    const [newSettings, setNewSettings] = React.useState<SdkSettings>({
        ...currSettings
    });

    const handleVisitorId = (e) =>
        setNewSettings({
            ...newSettings,
            visitorData: {
                ...newSettings.visitorData,
                id: e?.target?.value
            }
        });

    const handleAnonymous = (e) =>
        setNewSettings({
            ...newSettings,
            visitorData: {
                ...newSettings.visitorData,
                isAuthenticated: e.currentTarget.checked
            }
        });

    const handleVisitorContext = (e) => {
        const node = JSON.parse(e.currentTarget.parentElement.innerText);
        const temp = { ...newSettings };
        if (e.currentTarget.checked) {
            setNewSettings({
                ...newSettings,
                visitorData: {
                    ...newSettings.visitorData,
                    context: {
                        ...newSettings.visitorData.context,
                        [Object.keys(node)[0]]: true
                    }
                }
            });
        } else {
            const keyToRemove = Object.keys(node)[0];
            setNewSettings({
                ...newSettings,
                visitorData: {
                    ...newSettings.visitorData,
                    context: Object.entries(temp.visitorData.context).reduce((reducer, [key, value]) => {
                        if (key === keyToRemove) {
                            if (Object.keys(config.visitorData.context).includes(keyToRemove)) {
                                return { ...reducer, [key]: false };
                            }
                            return reducer;
                        }
                        return { ...reducer, [key]: value };
                    }, {})
                }
            });
        }
    };
    return (
        <>
            <Form>
                <Form.Group
                    controlId="initForm.ControlSelect2"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginLeft: '16px'
                    }}
                >
                    <div>visitor id: </div>
                    <Form.Control
                        type="text"
                        className="fsTextField"
                        onChange={handleVisitorId}
                        value={newSettings.visitorData.id}
                        placeholder={newSettings.visitorData.id || 'this field is required !'}
                    ></Form.Control>
                </Form.Group>
                <div className="fsAnchor" id="playWithVisitorContext" />
                <Form.Group controlId="initForm.ControlSelect3">
                    <Form.Label>visitor context</Form.Label>
                    {Object.entries({
                        ...config.visitorData.context,
                        ...newSettings.visitorData.context
                    }).map(([key, value]) => (
                        <Form.Check
                            key={key}
                            type="checkbox"
                            id={`default-${key}`}
                            checked={newSettings.visitorData.context.hasOwnProperty(key) ? !!value : false}
                            onChange={handleVisitorContext}
                            label={JSON.stringify({ [key]: value })}
                        />
                    ))}
                </Form.Group>
                <Form.Group controlId="initForm.ControlSelect4">
                    <Form.Label>visitor anonymous ?</Form.Label>
                    <Form.Check
                        type="checkbox"
                        id={`default-isAuthenticated`}
                        checked={newSettings.visitorData.isAuthenticated || false}
                        onChange={handleAnonymous}
                        label={'isAuthenticated=' + newSettings.visitorData.isAuthenticated}
                    />
                </Form.Group>
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
                        setSettings({ ...newSettings });
                        NotificationManager.info('Settings updated');
                    }}
                >
                    Apply change
                </Button>
            </div>
        </>
    );
};

export default PlayVisitorData;
