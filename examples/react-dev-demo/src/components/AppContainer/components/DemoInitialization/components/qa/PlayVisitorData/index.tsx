import React, { useContext } from 'react';
import { Formik } from 'formik';
import { Form, Button, Col } from 'react-bootstrap';
import { SettingContext, AppSettings } from '../../../../../../../App';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';

const PlayVisitorData: React.FC = () => {
    const { currentSettings, setSettings } = useContext(SettingContext) as AppSettings;
    const [hasError, setError] = React.useState(false);
    return (
        <Formik
            initialValues={{
                vId: currentSettings.visitorData.id,
                vContext: currentSettings.visitorData.context
            }}
            validate={(values) => {
                const errors: any = {};
                if (!values.vId) {
                    errors.vId = 'Required';
                }
                return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
                setSubmitting(false);
                setSettings({
                    ...currentSettings,
                    visitorData: {
                        id: values.vId,
                        context: values.vContext || {}
                    }
                });
            }}
        >
            {({ handleSubmit, handleChange, handleBlur, setFieldValue, values, touched, isValid, errors }) => (
                <Form noValidate onSubmit={handleSubmit}>
                    <Form.Group as={Col} md="12" controlId="validationFormik01">
                        <Form.Label>Visitor ID</Form.Label>
                        <Form.Control
                            type="text"
                            name="vId"
                            value={values.vId}
                            onChange={handleChange}
                            isValid={touched.vId && !errors.vId}
                            isInvalid={!!errors.vId}
                        />
                        <Form.Control.Feedback type="invalid">{errors.vId}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="12" controlId="validationFormik02">
                        <Form.Label>Visitor Context</Form.Label>
                        <JSONInput
                            waitAfterKeyPress={3000}
                            id="a_unique_id"
                            placeholder={values.vContext}
                            locale={locale}
                            height="550px"
                            width="100%"
                            onChange={({ error, jsObject }) => {
                                if (!error) {
                                    setFieldValue('vContext', jsObject || {}, true);
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

export default PlayVisitorData;
