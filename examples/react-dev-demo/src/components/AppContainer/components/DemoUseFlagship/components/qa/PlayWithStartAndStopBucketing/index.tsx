import React from 'react';
import { AppSettings, SettingContext } from '../../../../../../../App';
import { Alert, Button } from 'react-bootstrap';
import { useFlagship } from '@flagship.io/react-sdk';
import { NotificationManager } from 'react-notifications';

const PlayWithStartAndStopBucketingQA: React.FC = () => {
    const { currentSettings /*, setSettings, QA */ } = React.useContext(SettingContext) as AppSettings;
    const { startBucketingPolling, stopBucketingPolling } = useFlagship();
    return (
        <>
            {currentSettings.decisionMode !== 'Bucketing' && (
                <div className="mv3">
                    <Alert variant="warning">
                        <b>NOTE:</b> You are NOT in bucketing mode. To do so, go to the{' '}
                        <a href="#playWithConfig">SDK settings</a>.
                    </Alert>
                </div>
            )}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-around'
                }}
            >
                <Button
                    variant="secondary"
                    onClick={() => {
                        const result = startBucketingPolling();
                        if (result.success) {
                            NotificationManager.info('Bucketing started');
                        } else {
                            NotificationManager.error('Bucketing cannot start with error: \n' + result.reason);
                        }
                    }}
                >
                    Start the bucketing
                </Button>
                <Button
                    variant="secondary"
                    onClick={() => {
                        const result = stopBucketingPolling();
                        if (result.success) {
                            NotificationManager.info('Bucketing stopped');
                        } else {
                            NotificationManager.error('Bucketing cannot start with error: \n' + result.reason);
                        }
                    }}
                >
                    Stop the bucketing
                </Button>
            </div>
        </>
    );
};

export default PlayWithStartAndStopBucketingQA;
