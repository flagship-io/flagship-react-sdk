import React, { useContext } from 'react';
import { Formik } from 'formik';
import { Form, Button, Col } from 'react-bootstrap';
import { SettingContext, AppSettings } from '../../../../../../../App';
const PlayVisitorData: React.FC = () => {
    const { currentSettings, setSettings } = useContext(
        SettingContext
    ) as AppSettings;
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
            {({
                handleSubmit,
                handleChange,
                handleBlur,
                values,
                touched,
                isValid,
                errors
            }) => (
                <Form noValidate onSubmit={handleSubmit}>
                    <Form.Group as={Col} md="12" controlId="validationFormik01">
                        <Form.Label>Environment ID</Form.Label>
                        <Form.Control
                            type="text"
                            name="envId"
                            value={values.vId}
                            onChange={handleChange}
                            isValid={touched.vId && !errors.vId}
                            isInvalid={!!errors.vId}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.vId}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <div className="flex justify-end ph3">
                        <Button variant="secondary" type="submit">
                            Apply change
                        </Button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default PlayVisitorData;
