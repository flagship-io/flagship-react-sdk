import React from 'react';
import { useFsModifications, useFsActivate } from '@flagship.io/react-sdk';
import { Button, Form, Col } from 'react-bootstrap';
import { Formik } from 'formik';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';

const PlayWithActivateQA: React.FC = () => {
    const [hasError, setError] = React.useState(false);
    const [toggle, setToggle] = React.useState(false);
    const [modificationToActivate, setModificationToActivate] = React.useState([
        'btnColor',
        'otherKey1',
        'otherKey2'
    ]);
    useFsActivate(modificationToActivate, [toggle]);
    return (
        <>
            <Formik
                initialValues={{
                    modificationToActivate: modificationToActivate
                }}
                validate={(values) => {
                    const errors: any = {};
                    if (!values.modificationToActivate) {
                        errors.modificationToActivate = 'Required';
                    }
                    return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                    setSubmitting(false);
                    setModificationToActivate([
                        ...values.modificationToActivate
                    ]);
                    setToggle(!toggle);
                }}
            >
                {({
                    handleSubmit,
                    handleChange,
                    handleBlur,
                    setFieldValue,
                    values,
                    touched,
                    isValid,
                    errors
                }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                        <Form.Group as={Col} md="12" controlId="settingsForm">
                            <Form.Label>
                                useFsModifications arguments
                            </Form.Label>
                            <JSONInput
                                id="modificationToActivate"
                                placeholder={values.modificationToActivate}
                                locale={locale}
                                height="550px"
                                width="100%"
                                onChange={({ error, jsObject }) => {
                                    if (!error) {
                                        setFieldValue(
                                            'modificationToActivate',
                                            jsObject || {},
                                            true
                                        );
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
                                Trigger activate
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    );
};

export default PlayWithActivateQA;
