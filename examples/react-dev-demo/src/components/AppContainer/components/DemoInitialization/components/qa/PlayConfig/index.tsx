import React, { useContext } from 'react';
import { Formik } from 'formik';
import { Form, Button, Col } from 'react-bootstrap';
import { SettingContext, AppSettings } from '../../../../../../../App';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
const PlayConfig: React.FC = () => {
    const { currentSettings, setSettings } = useContext(SettingContext) as AppSettings;

    const [hasError, setError] = React.useState(false);
    return (
        <Formik
            initialValues={{
                envId: currentSettings.envId,
                settings: {
                    fetchNow: currentSettings.fetchNow,
                    activateNow: currentSettings.activateNow,
                    decisionMode: currentSettings.decisionMode,
                    enableConsoleLogs: currentSettings.enableConsoleLogs,
                    enableErrorLayout: currentSettings.enableErrorLayout,
                    enableSafeMode: currentSettings.enableSafeMode,
                    nodeEnv: currentSettings.nodeEnv,
                    flagshipApi: currentSettings.flagshipApi,
                    apiKey: currentSettings.apiKey
                }
            }}
            validate={(values) => {
                const errors: any = {};
                if (!values.envId) {
                    errors.envId = 'Required';
                }
                return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
                setSubmitting(false);
                setSettings({
                    ...currentSettings,
                    envId: values.envId,
                    ...values.settings
                });
            }}
        >
            {({ handleSubmit, handleChange, handleBlur, setFieldValue, values, touched, isValid, errors }) => (
                <Form noValidate onSubmit={handleSubmit}>
                    <Form.Group as={Col} md="12" controlId="envIdForm">
                        <Form.Label>Environment ID</Form.Label>
                        <Form.Control
                            type="text"
                            name="envId"
                            value={values.envId}
                            onChange={handleChange}
                            isValid={touched.envId && !errors.envId}
                            isInvalid={!!errors.envId}
                        />
                        <Form.Control.Feedback type="invalid">{errors.envId}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="12" controlId="settingsForm">
                        <Form.Label>SDK settings props</Form.Label>
                        <JSONInput
                            id="settings"
                            placeholder={values.settings}
                            locale={locale}
                            height="550px"
                            width="100%"
                            onChange={({ error, jsObject }) => {
                                if (!error) {
                                    setFieldValue('settings', jsObject || {}, true);
                                    setError(false);
                                } else {
                                    setError(true);
                                }
                            }}
                            style={{
                                body: {
                                    fontSize: '16px'
                                }
                            }}
                        />
                    </Form.Group>
                    <div className="flex justify-end ph3">
                        <Button
                            disabled={hasError}
                            variant="secondary"
                            type="submit"
                            style={{
                                cursor: hasError ? 'not-allowed' : 'pointer'
                            }}
                        >
                            Apply change
                        </Button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default PlayConfig;
