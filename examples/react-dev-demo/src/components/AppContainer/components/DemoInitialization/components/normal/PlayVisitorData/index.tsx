import React, { useContext } from 'react';
import { Button, Form } from 'react-bootstrap';

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
                id: e.target.value
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
                    <div>visitorId: </div>
                    <Form.Control as="select" onChange={handleVisitorId}>
                        <option key={currSettings.visitorData.id}>{currSettings.visitorData.id}</option>
                        {config.sandbox.visitorId
                            .filter((i) => i !== currSettings.visitorData.id)
                            .map((id) => (
                                <option key={id}>{id}</option>
                            ))}
                    </Form.Control>
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
            </Form>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'flex-end'
                }}
            >
                <Button variant="secondary" onClick={() => setSettings({ ...newSettings })}>
                    Apply change
                </Button>
            </div>
        </>
    );
};

export default PlayVisitorData;
