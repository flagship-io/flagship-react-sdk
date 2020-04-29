import React, { useContext } from 'react';
import { Formik } from 'formik';
import { Form, Button, Col } from 'react-bootstrap';
import { SettingContext, AppSettings } from '../../../../../../../App';
const PlayConfig: React.FC = () => {
    const { currentSettings, setSettings } = useContext(
        SettingContext
    ) as AppSettings;
    return (
        <Formik
            initialValues={{ envId: currentSettings.envId }}
            validate={(values) => {
                const errors: any = {};
                if (!values.envId) {
                    errors.envId = 'Required';
                }
                return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
                setSubmitting(false);
                setSettings({ ...currentSettings, envId: values.envId });
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
                            value={values.envId}
                            onChange={handleChange}
                            isValid={touched.envId && !errors.envId}
                            isInvalid={!!errors.envId}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.envId}
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

export default PlayConfig;
